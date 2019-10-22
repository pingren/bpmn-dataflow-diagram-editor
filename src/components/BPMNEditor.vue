<template>
  <div>
    <el-card
      :body-style="{ padding:'5px', }"
      style="z-index:8;width:auto;left:calc(50% - 350px);position:absolute;"
    >
      <el-button
        :disabled="!canUndo"
        size="mini"
        icon="el-icon-refresh-left"
        @click="undo"
      >
        Undo 撤销
      </el-button>
      <el-button
        :disabled="!canRedo"
        size="mini"
        icon="el-icon-refresh-right"
        @click="redo"
      >
        Redo 恢复
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-document-add"
        @click="load"
      >
        Load XML 读取
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-upload"
        @click="save"
      >
        Save 保存 (DEMO)
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-video-play"
        type="success"
        @click="animate"
      >
        Run 运行 (DEMO)
      </el-button>
    </el-card>
    <div
      ref="content"
      style="width:100%;height:100%;"
      class="containers"
      @dragover.stop="dragover_handler"
      @drop.stop="drop_handler"
    />
    <div>
      <el-drawer
        title="Debugging"
        :visible.sync="drawerVisible"
        :modal="false"
        size="30%"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
        custom-class="devdrawer"
      >
        <el-button @click="copy">
          Copy Content 复制内容
        </el-button>
        <pre>{{ drawerContent }}</pre>
      </el-drawer>
    </div>
  </div>
</template>
<script>
// main dependecny 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// Cli tools 控制台工具
import CliModule from 'bpmn-js-cli'
// default BPMN graph
import diagramXML from '../../resources/diagram.bpmn'
// customization 自定义模块
import CustomModule from './module'
let ignoreList = [
  'bpmn:Process',
  'bpmn:SequenceFlow',
  'label',
  'bpmn:StartEvent',
  'bpmn:EndEvent',
]

export default {
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      modeling: null,
      commandStack: null,
      eventBus: null,
      canvas: null,
      drawerVisible: false,
      drawerContent: undefined,
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
    this.bpmnModeler = new BpmnModeler({
      container: this.$refs.content,
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
    // imoprt default diagram
    this.bpmnModeler.importXML(diagramXML, err => {
      if (err) {
        console.error(err)
      }
    })
    this.modeling = this.bpmnModeler.get('modeling')
    this.commandStack = this.bpmnModeler.get('commandStack')
    this.canvas = this.bpmnModeler.get('canvas')
    this.overlays = this.bpmnModeler.get('overlays')
    this.eventBus = this.bpmnModeler.get('eventBus')

    // dev debug only
    if (process.env.NODE_ENV !== 'production') {
      this.eventBus.on('element.dblclick', 10000, event => {
        // return false // will cancel event
        let el = event.element
        if (ignoreList.indexOf(el.type) === -1) {
          this.drawerContent = Object.assign({}, el.businessObject)
          this.drawerContent.attrs = Object.assign({}, el.businessObject.$attrs)
          if (this.drawerContent.attrs.PROPERTY) {
            this.drawerContent.attrs.PROPERTY = JSON.parse(
              this.drawerContent.attrs.PROPERTY
            )
          }
          this.drawerVisible = true
        }
        return false
      })
    }

    this.eventBus.on('element.click', 0, event => {
      // return false // will cancel event
      let el = event.element
      if (ignoreList.indexOf(el.type) === -1) {
        this.$emit('node-click', el.businessObject)
        return true
      }
      return false
    })

    this.eventBus.on('commandStack.changed', () => {
      this.clearSymbols()
    })
  },
  methods: {
    dragover_handler(ev) {
      ev.preventDefault()
    },
    drop_handler(ev) {
      ev.preventDefault()
      let node = window.draggingNode
      if (!node) {
        return
      }
      let viewbox = this.canvas.viewbox()
      let id = this.cli.create(
        node.data.type,
        {
          x: ev.offsetX + viewbox.x,
          y: ev.offsetY + viewbox.y,
        },
        'Process_1'
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
      // el.businessObject = Object.assign(el.businessObject, node.data)
      // delete el.businessObject.label
      el.businessObject.set('ID', node.data.ID)
      // Beautify element
      // width & height should reflect on both VIEW & XML
      el.width = el.businessObject.di.bounds.width =
        getTextWidth(el.businessObject.name, '12px Arial, sans-serif') + 65
      el.height = el.businessObject.di.bounds.height = 36
      // select/focus element
      this.bpmnModeler
        .get('interactionEvents')
        .triggerMouseEvent('click', Event, el)
      this.eventBus.fire('element.changed', {
        element: el,
      })
      window.draggingNode = null
    },
    clearSymbols() {
      let elements = this.cli.elements()
      for (let node of elements) {
        let el = this.cli.element(node)
        this.overlays.remove({ element: el })
      }
    },
    // animation DEMO
    animate() {
      this.clearSymbols()
      this.$emit('run')
      let elements = this.cli
        .elements()
        .filter(item => ignoreList.indexOf(this.cli.element(item).type) === -1)
      this.animateNext(elements, 0)
    },
    // animation DEMO
    animateNext(elements, index) {
      let element = elements[index]
      if (element === undefined) {
        return
      }
      let el = this.cli.element(element)
      this.overlays.add(el, {
        position: {
          top: -30,
          right: 0,
        },
        html: '<div class="loader"></div>',
      })
      setTimeout(() => {
        this.overlays.remove({ element: el })
        this.overlays.add(el, {
          position: {
            top: -30,
            right: 0,
          },
          html:
            '<span class="checkmark"><div class="checkmark_circle"></div><div class="checkmark_stem"></div><div class="checkmark_kick"></div></span>',
        })
        this.animateNext(elements, index + 1)
      }, 2000)
    },
    // Saving DEMO
    save() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(xml)
          this.drawerVisible = true
          this.drawerContent = xml
        }
      })
    },
    copy() {
      navigator.clipboard.writeText(this.drawerContent).then(
        () => {
          this.$message.success('Copied 已经复制')
        },
        error => {
          console.log(error)
          this.$message.error('Failed!Please copy mananuly 失败！请手动复制')
        }
      )
    },
    // load XML DEMO
    load() {
      let result = window.prompt(
        'Please input BPMN XML, You can copy/paste it after saving.\n 请输入 BPMN XML，你可以在保存之后复制/粘贴。',
        ''
      )
      if (result === null) {
        return
      }
      this.bpmnModeler.importXML(result, err => {
        if (err) {
          console.error(err)
          this.$message.error(
            'Loading Error Please Check XML. 读取失败请检查 XML 格式!'
          )
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
.devdrawer {
  height: 100%;
  overflow: auto !important;
}
/* Styles Required */
@import '~bpmn-js/dist/assets/diagram-js.css';
/* @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css'; */
/* @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'; */
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

/* Custom styles for animation */
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 9px;
  height: 9px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.checkmark {
  display: inline-block;
  width: 22px;
  height: 22px;
  transform: rotate(45deg);
}

.checkmark_circle {
  position: absolute;
  width: 22px;
  height: 22px;
  background-color: green;
  border-radius: 11px;
  left: 0;
  top: 0;
}

.checkmark_stem {
  position: absolute;
  width: 3px;
  height: 9px;
  background-color: #fff;
  left: 11px;
  top: 6px;
}

.checkmark_kick {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: #fff;
  left: 8px;
  top: 12px;
}
.containers {
  background-image: linear-gradient(
      to right,
      rgba(111, 111, 111, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(188, 188, 188, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
</style>
