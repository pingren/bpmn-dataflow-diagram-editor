// main dependecny 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// Cli tools 控制台工具
import CliModule from 'bpmn-js-cli'
// customization 自定义模块
import CustomModule from './module'

import store from './model/store'
import { operatorList } from '../mock'
const ignoreList = [
  'bpmn:Process',
  'bpmn:SequenceFlow',
  'label',
  'bpmn:StartEvent',
  'bpmn:EndEvent',
]
const processName = 'Process_1'
const StartEventName = 'StartEvent_1'
// const EndEventName = 'EndEvent_1'

let bpmnModeler,
  modeling,
  canvas,
  overlays,
  eventBus,
  interactionEvents,
  commandStack,
  cli, draggingNode

let addFlag, removeTargetNode

// TODO: add debug helper & diagram debug helper
function createBpmnModeler(container) {
  bpmnModeler = new BpmnModeler({
    container: container,
    // load custom module
    additionalModules: [CliModule, CustomModule],
    cli: {
      bindTo: 'cli',
    },
    bpmnRenderer: {
      defaultFillColor: '#fff',
      defaultStrokeColor: '#6CB139',
    },
  })
  modeling = bpmnModeler.get('modeling')
  canvas = bpmnModeler.get('canvas')
  overlays = bpmnModeler.get('overlays')
  eventBus = bpmnModeler.get('eventBus')
  interactionEvents = bpmnModeler.get('interactionEvents')
  commandStack = bpmnModeler.get('commandStack')
  cli = window.cli

  function registerEvents() {
    // click event: fire vuex mutation 'selectNode' with clicked node id
    eventBus.on('element.click', 0, event => {
      // return false // will cancel event
      let el = event.element
      if (ignoreList.indexOf(el.type) === -1) {
        if(store.state.currentNodeId !== el.businessObject.id) {
          store.commit('selectNode', el.businessObject)
        }
        return true
      }
      return false
    })
    // connection event: fire vuex mutation 'selectNode' with target node id
    eventBus.on('connection.add', 0, (event) => {
      let el = event.element.target
      store.commit('selectNode', el.businessObject)
    })
    // connection events: fire evaluateNodeData when connection logic changed
    eventBus.on(['connection.added','connection.remove','connection.changed'], 1000, (event) => {
      if(event.type === 'connection.added'){
        addFlag = true

      } else if(addFlag === true && event.type === 'connection.changed') {
        // addFlag is an ugly fix since targetRef will be undefined at first place
        // call evaluateNodeData when new connection created,
        evaluateNodeData(event.element.businessObject.targetRef, 'newConnectionToNode')
        addFlag = false
      }
      if(event.type === 'connection.remove') {
        removeTargetNode = event.element.businessObject.targetRef
      }
    })
    // commandStack event will fire when node attrs change and
    eventBus.on('commandStack.changed', 0 , event =>{
      if(event.businessObject){
        // let childNodes = getChildNodes(event.businessObject)
        evaluateNodeData(event.businessObject, 'nodeAttrsChanged')
      }
      if(removeTargetNode){
        // removeTargetNode is an ugly fix similar to addFlag
        // call evaluateNodeData when a connection removed
        evaluateNodeData(removeTargetNode, 'connectionRemoved')
        removeTargetNode = undefined
      }
    })
  }
  function unregisterEvents() {
    eventBus.off(['connection.add'])
  }
  // import done, register eventBus event
  eventBus.on('import.done', 0, () => {
    initModel()
    registerEvents()
  })
  // disable eventBus if import mutiple times
  eventBus.on('import.render.start', 0, unregisterEvents)
}
// init transferModel & visit from StartEventName to get all nodes input & output & transfer
// TODO: use bfs instead
function initModel(){
  function getProperty(businessObject) {
    try {
      if(businessObject.$attrs.PROPERTY){
        return JSON.parse(businessObject.$attrs.PROPERTY)
      }
    } catch (error) {
      throw error
    }
  }
  let nodes = cli.elements().flatMap(id => {
    let ele = cli.element(id).businessObject
    return ignoreList.indexOf(ele.$type) === -1 ? ele : []
  })
  for(let node of nodes) {
    store.commit('setTransfer', { id: node.id, obj: getProperty(node), init: true })
  }
  if(nodes.length > 0) {
    evaluateNodeData(cli.element(StartEventName).businessObject)
  }
}
// evaluateNodeInput from parents' nodeOutput according to config.input & then updateTransfer
function evaluateNodeInput(id) {

  let node = getNodeById(id)
  let operatorId = getAttrs(node).ID
  let config = operatorList.find(
    item => String(item.id) === String(operatorId)
  )
  if(config.input) {
    let parentNodes = getParentNodes(node)
    // console.log('parentNodes:', parentNodes)
    let parentOutputs = parentNodes.map(node => store.state.outputModel[node.id]).filter(item => item !== {} && item !== undefined)
    // console.log('parentOuputs:', parentOutputs)
    // config.input is an array of object, pick sepcific key arrays as nodeInput, and flatmap if needed
    // Example: input:[{key: ['c7-1','c7-2'], target: 'c7',mode: 'flatMap'}] means pick 'c7-1','c7-2', flatten result into c7
    // flatMap
    let resultObject = config.input.reduce((result, inputEntry) => {
      let currentObj
      if(inputEntry.key && inputEntry.target) {
        let keys = inputEntry.key
        if(typeof keys === 'string'){
          keys = [keys]
        }
        currentObj = parentOutputs.flatMap(output => keys.flatMap(key => output[key] ? output[key] : []))
        return Object.assign(result, {[inputEntry.target] : currentObj})
      }
    }, {})
    // if input Change commit to the vuex
    if(resultObject && diff(resultObject, store.state.inputModel[id])) {
      // console.log('nodeInput', resultObject)
      store.commit('setInput', {id, obj: resultObject})
      store.commit('updateTransfer', {id})
    }
  }
}
// evaluateNodeOuput from nodeTransfer according to config.output
function evaluateNodeOutput(id){

  let node = getNodeById(id)
  let operatorId = getAttrs(node).ID
  let property = store.state.transferModel[id]

  let config = operatorList.find(
    item => String(item.id) === String(operatorId)
  )
  if(config.output) {
    // config.output is an array of object, pick specific keys to nodeOutput, and maybe do a rename
    // Example: [{key:'option3',rename:'c7' }] means pick 'option3', and rename it to c7.
    // reduce
    //  note this will override entry with same keys, so keep diffrent output keys by using rename
    let resultObject = config.output.reduce((result, outputEntry) => {
      let currentObj
      if(outputEntry.key && property[outputEntry.key]) {
        let outKey = outputEntry.rename ? outputEntry.rename : outputEntry.key
        currentObj = {[outKey]: property[outputEntry.key]}
      }
      return Object.assign(result, currentObj)
    }, {})

    // if output Change commit to the vuex
    if(resultObject && diff(resultObject, store.state.outputModel[id])) {
      // console.log('nodeOutput', resultObject)
      store.commit('setOutput', {id, obj: resultObject})
    }
  }
}
// dfs eval nodes , maybe buggy, so to be removed
function evaluateNodeData(businessObject, type = '', visited = []){
  if(visited.indexOf(businessObject.id) !== -1) {
    alert(`found loop in the diagram, please fix:${businessObject.name}`)
    return
  }
  let id = businessObject.id
  console.log(type, ": ",businessObject.name)
  if (ignoreList.indexOf(businessObject.$type) === -1) {
    evaluateNodeInput(id)
    evaluateNodeOutput(id)
  }
  // if output change then evaluate all Child Nodes

  // TODO: remove this, use BFS instead
  let childNodes = getChildNodes(businessObject)
  // console.log('childNodes:', childNodes)
  if(childNodes.length){
    childNodes.forEach(node => {
      evaluateNodeData(node, 'dfs', visited.concat(id))
    })
  }
}
function diff(obj1, obj2) {
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}
function createNode(node, x, y) {
  let viewbox = canvas.viewbox()
  let id = cli.create(
    node.data.type,
    {
      x: x + viewbox.x,
      y: y + viewbox.y,
    },
    processName
  )
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement('canvas'))
    var context = canvas.getContext('2d')
    context.font = font
    var metrics = context.measureText(text)
    return metrics.width
  }
  let el = cli.element(id)
  el.businessObject.name = node.data.label
  // el.businessObject = Object.assign(el.businessObject, node.data)
  // delete el.businessObject.label
  el.businessObject.set('ID', node.data.ID)
  // Beautify element
  // width & height should reflect on both VIEW & XML
  el.width = el.businessObject.di.bounds.width =
    getTextWidth(el.businessObject.name, '12px Arial, sans-serif') + 65
  el.height = el.businessObject.di.bounds.height = 36
  // select/focus element
  interactionEvents.triggerMouseEvent('click', Event, el)
  eventBus.fire('element.changed', {
    element: el,
  })
}
  // let obj = cli.element(StartEventName).businessObject

function getNodeById(id) {
  try{
    return cli.element(id).businessObject
  }
  catch {
    return undefined
  }
}
function getChildNodes(businessObject) {
  try {
  return businessObject.outgoing.map((ele) => ele.targetRef)
  }
  catch {
    return []
  }
}
function getParentNodes(businessObject) {
  try {
    return businessObject.incoming.map((ele) => ele.sourceRef)
  }
  catch {
    return []
  }
}

// TODO: connect nodes on the graph
// eslint-disable-next-line
function setTargetNodes(businessObject, ...businessObjects) {

}

function getAttrs(businessObject) {
  try {
    return businessObject.$attrs
  } catch (error) {
    throw error
  }
}

function setDraggingNode(node) {
  draggingNode = node
}
export {
  bpmnModeler,
  modeling,
  canvas,
  overlays,
  cli,
  createBpmnModeler,
  draggingNode,
  eventBus,
  createNode,
  setDraggingNode,
  commandStack,
  getChildNodes,
  getParentNodes,
  getNodeById,
}
