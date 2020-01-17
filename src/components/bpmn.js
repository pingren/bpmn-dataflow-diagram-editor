// main dependecny 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// Cli tools 控制台工具
import CliModule from 'bpmn-js-cli'

// customization 自定义模块
import CustomModule from './module'

import store from './model/store'
const ignoreList = [
  'bpmn:Process',
  'bpmn:SequenceFlow',
  'label',
  'bpmn:StartEvent',
  'bpmn:EndEvent',
]
const processName = 'Process_1'

let bpmnModeler,
  modeling,
  canvas,
  overlays,
  eventBus,
  interactionEvents,
  commandStack

let cli, draggingNode

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

  eventBus.on('element.click', 0, event => {
    // return false // will cancel event
    let el = event.element
    if (ignoreList.indexOf(el.type) === -1) {
      store.commit('selectNode', el.businessObject)
      return true
    }
    return false
  })
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
}
