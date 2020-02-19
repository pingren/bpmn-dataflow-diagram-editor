// main dependecny 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// Cli tools 控制台工具
import CliModule from 'bpmn-js-cli'
// customization 自定义模块
import CustomModule from './module'

import store from './store'
import { operatorList } from './mock'
import { MessageBox } from 'element-ui';

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

export default class Diagram {

  constructor(container, key = Date.now()) {
    this.key = key
    this.bpmnModeler = new BpmnModeler({
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
    this.modeling = this.bpmnModeler.get('modeling')
    this.canvas = this.bpmnModeler.get('canvas')
    this.overlays = this.bpmnModeler.get('overlays')
    this.eventBus = this.bpmnModeler.get('eventBus')
    this.interactionEvents = this.bpmnModeler.get('interactionEvents')
    this.commandStack = this.bpmnModeler.get('commandStack')
    this.selection = this.bpmnModeler.get('selection')
    this.zoomScroll = this.bpmnModeler.get('zoomScroll')
    // disable mouse wheel scroll but keep zoom
    // eslint-disable-next-line
    this.zoomScroll.__proto__.scroll = () => {}
    this.cli = window.cli
    this.nodesToEvaluate = new Set()
    const registerEvents = () => {
      // disable mousedown when diagram is running, so element is not draggable
      // this.eventBus.on('element.mousedown', 10000, (event) => {
      //   if (true && event.element.id !== processName) {
      //     return false
      //   }
      // })
      // nodes create event
      this.eventBus.on('commandStack.shape.create.postExecute', 0, event => {
        this._addDebugOverlayToNode(event.context.shape.businessObject)
      })
      // click event: fire vuex mutation 'selectNode' with clicked node id
      this.eventBus.on('element.click', 0, event => {
        let el = event.element
        if (ignoreList.indexOf(el.type) === -1) {
          // make sure not mutiple elements selected
          let els = this.selection.get()
          if(store.state[this.key].currentNodeId !== el.businessObject.id && els.length === 1) {
            store.commit('selectNode', el.businessObject)
          }
          return true
        }
        else {
          // return false will cancel event
          return false
        }
      })
      // connection events: fire _evaluateNodeData when connection logic changed
      this.eventBus.on(['connection.add', 'connection.removed'], 0, (event) => {
        if(event.type === 'connection.add'){
          let node = event.element.target.businessObject
          this._evaluateNodeData(node, 'newConnectionToNode')
          // connection event: fire vuex mutation 'selectNode' with target node, this should be disabled when importing graph
          store.commit('selectNode', node)
        }
        if(event.type === 'connection.removed') {
          // add all connections target to nodesToEvaluate set to prevent duplicated nodes
          this.nodesToEvaluate.add(event.element.target.businessObject)
        }
      })
      // commandStack event will fire when node attrs change and connections removed
      this.eventBus.on('commandStack.changed', 0 , event =>{
        if(event.node){
          this._evaluateNodeData(event.node, 'nodeAttrsChangedByUser')
        }
        else {
          for(let node of this.nodesToEvaluate) {
            this._evaluateNodeData(node, 'connectionRemovedByUser')
          }
          this.nodesToEvaluate = new Set()
        }
      })
    }
    const unregisterEvents = () => {
      this.eventBus.off(['connection.add'])
    }
    // init vuex model for loaded graph through cli
    const initModel = () => {
      let nodes = this.cli.elements().flatMap(id => {
        let ele = this.cli.element(id).businessObject
        return ignoreList.indexOf(ele.$type) === -1 ? ele : []
      })
      // setTransfer for all nodes from xml
      for(let node of nodes) {
        store.commit('setTransfer', { id: node.id, obj: getProperty(node), init: true, diagram: this })
        this._addDebugOverlayToNode(node)
      }
      // BFS from StartEvent Node to get vuex model
      if(nodes.length > 0) {
        this._evaluateNodeData(this.cli.element(StartEventName).businessObject, 'Init BFS')
      }
    }
    // import done, register eventBus event
    this.eventBus.on('import.done', 0, () => {
      let attrs = getAttrs(this.cli.element(processName).businessObject)
      if(Object.keys(attrs).length !== 0){
        // canvas.zoom(attrs.scale)
        store.commit('setZoomLevel', attrs.scale)
        this.canvas.viewbox(attrs)
      }else {
        store.commit('setZoomLevel', 1)
      }
      initModel()
      registerEvents()
    })
    // disable eventBus if import mutiple times
    this.eventBus.on('import.render.start', 0, unregisterEvents)
  }
  importXML(xml){
    return new Promise(
      (resolve, reject) => {
        this.bpmnModeler.importXML(xml, err => {
        if (err) {
            reject(err)
        }
        resolve()
      })
    })
  }
  exportSVG(){
    return new Promise(
      (resolve, reject) => {
        this.bpmnModeler.saveSVG({ format: true }, (err, svg) => {
          if (err) {
            reject(err)
          }
          resolve(svg)
        })
      }
    )
  }
  exportSVGDataURL(){
    return new Promise(
      (resolve, reject) => {
        this.exportSVG().then(svg => {
          // don't use base64 encoded dataURL, since it won't support Chinese
          let txt = svg.replace(/"/g, '\'')
          .replace(/%/g, '%25')
          .replace(/#/g, '%23')
          .replace(/{/g, '%7B')
          .replace(/}/g, '%7D')
          .replace(/</g, '%3C')
          .replace(/>/g, '%3E')
          .replace(/\s+/g,' ')
          .replace(/url\('(.*?)'\)/g,'$1')
          // Chrome 79.0.3945.130 can not rendener marker-end: url('#sequenceflow-end-white-black-2mj337judsuz9qy2clgjk8nsd');"
          // this regex is needed to remove those two single qutoes
          //  .replace(/&/g, '%26')
          //  .replace('|', '%7C')
          //  .replace('[', '%5B')
          //  .replace(']', '%5D')
          //  .replace('^', '%5E')
          //  .replace('`', '%60')
          //  .replace(';', '%3B')
          //  .replace('?', '%3F')
          //  .replace(':', '%3A')
          //  .replace('@', '%40')
          //  .replace('=', '%3D')
          resolve(`data:image/svg+xml,${txt}`)
        }).catch(error => reject(error))
      }
    )
  }
  exportXML(isFormat = true){
    let rootNode = this.cli.element(processName).businessObject
    let viewbox = this.canvas.viewbox()
    rootNode.set('x', viewbox.x)
    rootNode.set('y', viewbox.y)
    rootNode.set('width', viewbox.width)
    rootNode.set('height', viewbox.height)
    rootNode.set('scale', viewbox.scale)
    return new Promise(
      (resolve, reject) => {
        this.bpmnModeler.saveXML({ format: isFormat }, (err, xml) => {
          if (err) {
            reject(err)
          }
          resolve(xml)
        })
      }
    )
  }
  getNodeById(id) {
    try{
      return this.cli.element(id).businessObject
    }
    catch {
      return undefined
    }
  }
  createNode(node, x, y) {
    // console.log(canvas.viewbox(), canvas._cachedViewbox)
    let viewbox = this.canvas.viewbox()
    let scale = viewbox.scale
    let id = this.cli.create(
      node.data.type,
      {
        x: x / scale + viewbox.x,
        y: y / scale + viewbox.y,
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
    let el = this.cli.element(id)
    el.businessObject.name = node.data.label
    el.businessObject.set('ID', node.data.ID)
    // Beautify element
    // width & height should reflect on both VIEW & XML
    el.width = el.businessObject.di.bounds.width =
      getTextWidth(el.businessObject.name, '12px Arial, sans-serif') + 65
    el.height = el.businessObject.di.bounds.height = 36
    // select/focus element
    this.interactionEvents.triggerMouseEvent('click', Event, el)
    this.eventBus.fire('element.changed', {
      element: el,
    })
  }
  setDraggingNode(node) {
    this.draggingNode = node
  }
  // _evaluateNodeInput from parents' nodeOutput according to config.input & then updateTransfer
  _evaluateNodeInput(node) {

  let operatorId = getAttrs(node).ID
  let config = operatorList.find(
    item => String(item.id) === String(operatorId)
  )
  const getParentNodes = (node) => {
    try {
      return this.cli.element(node.id).incoming.map(connection => connection.source.businessObject)
    }
    catch {
      return []
    }
  }
  if(config.input) {
    let parentNodes = getParentNodes(node)
    // console.log('parentNodes:', parentNodes)
    let parentOutputs = parentNodes.map(parentNode => store.state[this.key].outputModel[parentNode.id]).filter(item => item !== {} && item !== undefined)
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
    if(resultObject && diff(resultObject, store.state[this.key].inputModel[node.id])) {
      // console.log('nodeInput', resultObject)
      store.commit('setInput', {id: node.id, obj: resultObject})
      store.commit('updateTransfer', {id: node.id})
    }
  }
}
  // evaluateNodeOuput from nodeTransfer according to config.output
  _evaluateNodeOutput(node){

    let operatorId = getAttrs(node).ID
    let property = store.state[this.key].transferModel[node.id]

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
      if(resultObject && diff(resultObject, store.state[this.key].outputModel[node.id])) {
        // console.log('nodeOutput', resultObject)
        store.commit('setOutput', {id: node.id, obj: resultObject})
      }
    }
  }
  // bfs eval nodes asynchronously
  _evaluateNodeData(nodesToVisit, type = ''){
    const getChildNodes = (node) => {
      try {
        return this.cli.element(node.id).outgoing.map(connection => connection.target.businessObject)
      }
      catch {
        return []
      }
    }
    // TODO: use DFS check if there is a loop in the diagram before continue
    if(nodesToVisit.length === undefined && nodesToVisit.id) {
      nodesToVisit = [nodesToVisit]
    }
    let nodesBatch = nodesToVisit;
    nodesToVisit = [];
    Promise.each(nodesBatch, node => {
      // check the node still exist only the graph
      if(this.getNodeById(node.id)) {
        console.log(`${type}: ${node.id}, ${node.name}`);
        // only evaluate nodes not ignored
        if (ignoreList.indexOf(node.$type) === -1) {
          this._evaluateNodeInput(node)
          this._evaluateNodeOutput(node)
        }
        let childNodes = getChildNodes(node)
        nodesToVisit = nodesToVisit.concat(childNodes)
      }
    }).then(() => {
      if(nodesToVisit.length > 0) {
        this._evaluateNodeData(nodesToVisit, "BFS")
      }
    })
  }
  _addDebugOverlayToNode(node){
    // return
    let div = document.createElement("button");
    let text = document.createTextNode(`${node.id}`);
    div.appendChild(text);
    div.onclick = () => {
      const nodeHTML = `<pre>NODE: ${JSON.stringify(node, null, 2)}</pre>`
      const nodeAttrsHTML = `<pre>ATTRS: ${JSON.stringify(getAttrs(node), null, 2)}</pre>`
      const nodePropertyHTML = `<pre>PROPERTY: ${JSON.stringify(getProperty(node), null, 2)}</pre>`
      MessageBox(
        {
          message:`<style type="text/css">
                  .DebugMessageBox {
                    width: 70vw;
                  }
                  </style>
          <div style="overflow:auto;max-height: 90vh;">${nodeHTML + nodeAttrsHTML + nodePropertyHTML}<div>`,
          title: 'Node Debug Viewer',
          dangerouslyUseHTMLString: true,
          customClass:"DebugMessageBox",
        }
      )
    };
    this.overlays.add(node.id, {
      position: {
        bottom: 0,
      },
      html: div
    });
  }
}
// Promise helper for bfs
Promise.each = async function(arr, fn) { // take an array and a function
  for(const item of arr) await fn(item);
}
function diff(obj1, obj2) {
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}


// TODO: connect nodes on the graph
// eslint-disable-next-line
function setTargetNodes(node, ...nodes) {

}

function getAttrs(businessObject) {
  try {
    return businessObject.$attrs
  } catch (error) {
    throw error
  }
}
function getProperty(node) {
  try {
    let attrs = getAttrs(node)
    if(attrs){
      return JSON.parse(attrs.PROPERTY)
    }
  } catch (error) {
    throw error
  }
}
