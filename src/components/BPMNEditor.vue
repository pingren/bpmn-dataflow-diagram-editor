<template>
  <div>
    <el-card
      :body-style="{ padding:'5px', }"
      style="z-index:9;width:auto;left:calc(50% - 240px);position:absolute;"
    >
      <el-button
        :disabled="!canUndo"
        size="mini"
        icon="el-icon-refresh-left"
        @click="undo"
      >
        撤销
      </el-button>
      <el-button
        :disabled="!canRedo"
        size="mini"
        icon="el-icon-refresh-right"
        @click="redo"
      >
        恢复
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-upload"
        @click="save"
      >
        保存
      </el-button>
      <!-- <el-button
        size="mini"
        @click="modify"
      >
        修改属性（标题）测试
      </el-button> -->
      <el-button
        size="mini"
        icon="el-icon-video-play"
        type="primary"
        @click="animate"
      >
        运行
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
// import tokenSimulation from 'bpmn-js-token-simulation/lib/viewer'
let ignoreList = ['bpmn:Process', 'bpmn:SequenceFlow', 'label']

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
      additionalModules: [CliModule, CustomModule],
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
    this.overlays = this.bpmnModeler.get('overlays')
    this.eventBus = this.bpmnModeler.get('eventBus')
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
    this.eventBus.on('element.click', 0, event => {
      // return false // will cancel event
      let el = event.element
      if (ignoreList.indexOf(el.type) === -1) {
        this.$emit('node-click', el.businessObject)
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
      this.cli.setLabel(id, node.data.label)
      // TODO: 这样会导致一条历史记录，因此直接修改对象的 name, need fix
      let el = this.cli.element(id)
      el.businessObject.name = node.data.label
      this.eventBus.fire('element.changed', {
        element: el,
      })
      // console.log(el)
      // console.log(el.businessObject)
      window.draggingNode = null
    },
    animate() {
      // let nodes = document.querySelectorAll('[data-element-id]')
      // nodes[2].style.display = 'none'
      // nodes[2].style.opacity = '0.3'
      // console.log(nodes)
      let elements = this.cli.elements()
      this.animateNext(elements, 0)
      // elements.forEach((element, index) => {
      //   let el = this.cli.element(element)
      //   if (ignoreList.indexOf(el.type) === -1)
      //     overlays.add(el, {
      //       position: {
      //         top: -30,
      //         right: 0,
      //       },
      //       html: '<div class="loader"></div>',
      //     })
      //   // overlays.remove({ element: el })
      // })
    },
    animateNext(elements, index) {
      let element = elements[index]
      if (element === undefined) {
        return
      }
      let el = this.cli.element(element)

      if (ignoreList.indexOf(el.type) === -1)
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
/* @import '~bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css'; */
/* 禁用logo */
.bjs-powered-by {
  display: none;
}
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 15px;
  height: 15px;
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
  -ms-transform: rotate(45deg); /* IE 9 */
  -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
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
</style>
