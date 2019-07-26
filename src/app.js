import BpmnModeler from 'bpmn-js/lib/Modeler'
// import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import CliModule from 'bpmn-js-cli'

import diagramXML from '../resources/diagram.bpmn'

import customModule from './custom'
import Vue from 'vue'
// import qaExtension from '../resources/qa'
console.log('23333')

const containerEl = document.getElementById('container')
console.log(containerEl)

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  // 左边工具栏以及节点
  // 右边的工具栏
  additionalModules: [customModule, CliModule],
  // 节点的扩展显示
  // moddleExtensions: {
  //   qa: qaExtension,
  // },
  cli: {
    bindTo: 'cli',
  },
})

// import XML
bpmnModeler.importXML(diagramXML, err => {
  if (err) {
    console.error(err)
  }
})
Vue.forceUpdate()
