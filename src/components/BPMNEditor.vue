<template>
  <div>
    <el-button @click="save">
      保存
    </el-button>
    <el-button
      :disabled="!canUndo"
      @click="undo"
    >
      撤销
    </el-button>
    <el-button
      :disabled="!canRedo"
      @click="redo"
    >
      重做
    </el-button>
    <el-button @click="modify">
      修改标题
    </el-button>
    <div
      ref="content"
      style="width:100%;height:100%;"
      class="containers"
      @dragover.stop="dragover_handler"
      @drop.stop="drop_handler"
    />
  </div>
</template>
<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import CliModule from 'bpmn-js-cli'
import diagramXML from '../../resources/diagram.bpmn'

// import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

export default {
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      modeling: null,
      commandStack: null,
      eventBus: null,
      canvas: null,
      processName: '',
    }
  },
  computed: {
    canUndo() {
      return this.commandStack ? this.commandStack.canUndo() : false
    },
    canRedo() {
      return this.commandStack ? this.commandStack.canRedo() : false
    },
    cli() {
      return window.cli
    },
  },
  mounted() {
    function CustomContextPadProvider(contextPad) {
      contextPad.registerProvider(this)

      this.getContextPadEntries = function(element) {
        // no entries, effectively disable the context pad
        return {}
      }
    }
    CustomContextPadProvider.$inject = ['contextPad']
    this.bpmnModeler = new BpmnModeler({
      container: this.$refs.content,
      // 左边工具栏以及节点
      // 右边的工具栏
      additionalModules: [
        CliModule,
        // overrideModule,
        {
          // moveCanvas: ['value', ''],
          zoomScroll: ['value', ''],
          // contextPadProvider: ['value', ''],
        },
      ],
      // 节点的扩展显示
      // moddleExtensions: {
      //   qa: qaExtension,
      // },
      cli: {
        bindTo: 'cli',
      },
    })
    // import XML
    this.bpmnModeler.importXML(diagramXML, err => {
      if (err) {
        console.error(err)
      }
    })
    this.modeling = this.bpmnModeler.get('modeling')
    this.commandStack = this.bpmnModeler.get('commandStack')
    this.canvas = this.bpmnModeler.get('canvas')
    this.eventBus = this.bpmnModeler.get('eventBus')
    this.eventBus.on('element.dblclick', 10000, function(event) {
      return false // will cancel event
    })
  },
  methods: {
    dragover_handler(ev) {
      ev.preventDefault()
      // Set the dropEffect to move
      //  ev.dataTransfer.dropEffect = "move"
    },
    drop_handler(ev) {
      ev.preventDefault()
      // Get the id of the target and add the moved element to the target's DOM
      //  var data = ev.dataTransfer.getData("text");
      //  ev.target.appendChild(document.getElementById(data));
      let rx = ev.offsetX
      let ry = ev.offsetY
      // debugger
      // console.log('dropped', rx, ry)
      // cli.create('bpmn:EndEvent', { x: rx, y: ry }, 'Process_1')
      let viewbox = this.canvas.viewbox()
      let task = this.cli.create(
        'bpmn:Task',
        {
          x: rx + viewbox.x,
          y: ry + viewbox.y,
        },
        'Process_1'
      )
      this.cli.setLabel(task, window.draggingNode.data.label)
    },
    modify() {
      let obj = this.cli.element('StartEvent_1')
      // this.cli.element('StartEvent_1').businessObject.name = 'fun'
      this.modeling.updateProperties(obj, { name: 'lol' })
      window.canvas = this.canvas
    },
    save() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        // log the current xml content to the browser console
        if (err) {
          console.log(err)
        } else {
          console.log(xml)
          alert(xml)
        }
      })
    },
    undo() {
      window.cli.undo()
    },
    redo() {
      window.cli.redo()
    },
  },
}
</script>
<style lang="css">
/*左边工具栏以及编辑节点的样式*/
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
/* @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'; */
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
.bjs-powered-by {
  display: none;
}
</style>
