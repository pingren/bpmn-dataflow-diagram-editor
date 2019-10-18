import InteractionEvents from './InteractionEvents'
import ContextPadProvider from './ContextPadProvider'
import BpmnRules from './BpmnRules'
import BpmnRenderer from './BpmnRenderer'

export default {
  __init__: ['interactionEvents'],
  // context 面板
  contextPadProvider: ['type', ContextPadProvider],
  // label 拖动禁用
  interactionEvents: ['type', InteractionEvents],
  // label 编辑禁用
  labelEditingProvider: ['value', ''],
  labelEditingPreview: ['value', ''],
  // palette 禁用
  paletteProvider: ['value', ''],
  // 滚轮禁用
  zoomScroll: ['value', ''],
  // 多次连接禁用，连接线规则修改
  bpmnRules: ['type', BpmnRules],
  // 画布拖动禁用
  // moveCanvas: ['value', ''],
  bpmnRenderer: ['type', BpmnRenderer],
}
