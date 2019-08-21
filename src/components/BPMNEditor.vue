<template>
  <div>
    <span>双击节点查看属性</span>
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
      修改属性（标题）测试
    </el-button>
    <div
      ref="content"
      style="width:100%;height:100%;"
      class="containers"
      @dragover.stop="dragover_handler"
      @drop.stop="drop_handler"
    />
    <div>
      <el-drawer
        title="属性查看"
        :visible.sync="drawerVisible"
        :modal="false"
        size="35%"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
      >
        <pre>{{ drawerContent }}</pre>
      </el-drawer>
    </div>
  </div>
</template>
<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 控制台工具
import CliModule from 'bpmn-js-cli'

// 默认载入的 BPMN
import diagramXML from '../../resources/diagram.bpmn'
// 自定义模块
import CustomModule from './module'
// token 动画
import tokenSimulation from 'bpmn-js-token-simulation/lib/viewer'
// var tokenSimulation = require('./lib/modeler')

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
      // 容器
      container: this.$refs.content,
      // 模块
      additionalModules: [CliModule, CustomModule, tokenSimulation],
      cli: {
        bindTo: 'cli',
      },
    })
    // 导入
    this.bpmnModeler.importXML(diagramXML, err => {
      if (err) {
        console.error(err)
      }
    })

    this.modeling = this.bpmnModeler.get('modeling')
    this.commandStack = this.bpmnModeler.get('commandStack')
    this.canvas = this.bpmnModeler.get('canvas')
    this.eventBus = this.bpmnModeler.get('eventBus')
    let ignoreList = ['bpmn:Process', 'bpmn:SequenceFlow', 'label']
    this.eventBus.on('element.dblclick', 10000, event => {
      // return false // will cancel event
      let el = event.element
      if (ignoreList.indexOf(el.type) === -1) {
        this.drawerContent = el.businessObject
        console.log(el)
        this.drawerVisible = true
      }
      return false
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
      // this.cli.setLabel(id, node.data.label)
      // 这样会导致一条历史记录，因此直接修改对象的 name, need fix
      let el = this.cli.element(id)
      el.businessObject.name = node.data.label
      this.eventBus.fire('element.changed', {
        element: el,
      })
      // console.log(el)
      // console.log(el.businessObject)
      window.draggingNode = null
    },
    modify() {
      let obj = this.cli.element('StartEvent_1')
      this.modeling.updateProperties(obj, { name: 'lol' })
      // obj.name = 'lol'
    },
    save() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.log(err)
        } else {
          console.log(xml)
          let definitions = this.bpmnModeler.get('canvas').getRootElement()
            .businessObject.$parent
          console.log(JSON.stringify(definitions))
          alert(`查看浏览器控制台~`)
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
/* 默认样式 */
@import '~bpmn-js/dist/assets/diagram-js.css';
/* @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css'; */
/* @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'; */
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
@import '~bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
/* @import '~bpmn-js-token-simulation/assets/css/normalize.css'; */
/* 禁用logo */
.bjs-powered-by {
  display: none;
}
</style>
