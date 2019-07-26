import CustomContextPad from './CustomContextPad';
import CustomContextPadAdd from './CustomContextPadAdd';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';

export default {
  __init__: [ 'customContextPad','customContextPadAdd', 'customPalette', 'customRenderer' ],
  // 关闭默认的 ContextPad
  contextPadProvider: [ 'type', CustomContextPadProvider ],
  // 快速添加 CustomContextPadAdd
  customContextPadAdd:[ 'type', CustomContextPadAdd ],
  // 含有删除的 CustomContextPad
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ]
};

// 返回空覆盖 Provider
function CustomContextPadProvider(contextPad) {
  
    contextPad.registerProvider(this);
    this.getContextPadEntries = function(element) {
      // no entries, effectively disable the context pad
      return {};
    };
}
CustomContextPadProvider.$inject = [ 'contextPad' ];