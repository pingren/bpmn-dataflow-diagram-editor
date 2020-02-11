import InteractionEvents from './InteractionEvents'
import ContextPadProvider from './ContextPadProvider'
import BpmnRules from './BpmnRules'
import BpmnRenderer from './BpmnRenderer'

export default {
  __init__: ['interactionEvents'],
  // custom contextPadProvider 自定义面板
  contextPadProvider: ['type', ContextPadProvider],
  // disable label dragging 拖动禁用
  interactionEvents: ['type', InteractionEvents],
  // disable label content editing 编辑禁用
  labelEditingProvider: ['value', ''],
  labelEditingPreview: ['value', ''],
  // disable left palette 禁用
  paletteProvider: ['value', ''],
  // disable multiple connections between two nodes 多次连接禁用，连接线规则修改
  bpmnRules: ['type', BpmnRules],
  // custom BpmnRenderer for node styles 自定义元素样式
  bpmnRenderer: ['type', BpmnRenderer],
}
