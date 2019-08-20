import InteractionEvents from './InteractionEvents'

function CustomContextPadProvider(contextPad) {
  contextPad.registerProvider(this)

  this.getContextPadEntries = function(element) {
    // no entries, effectively disable the context pad
    return {}
  }
}
CustomContextPadProvider.$inject = ['contextPad']

export default {
  __init__: ['interactionEvents'],
  // label 拖动禁用
  interactionEvents: ['type', InteractionEvents],
  // label 编辑禁用
  labelEditingProvider: ['value', ''],
  labelEditingPreview: ['value', ''],
  // palette 禁用
  paletteProvider: ['value', ''],
  // 滚轮禁用
  zoomScroll: ['value', ''],
  // context 面板禁用
  // contextPadProvider: ['value', ''],
  // 画布拖动禁用
  // moveCanvas: ['value', ''],
}
