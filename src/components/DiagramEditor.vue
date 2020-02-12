<template>
  <el-container>
    <PanelLeft />
    <PanelTop />
    <PanelRight />
    <ZoomSlider style="position:absolute; bottom:100px;left: 300px;" />
    <div
      ref="content"
      style="height:calc(100vh - 72px);width:100%;"
      class="containers"
      @dragover.stop="dragover_handler"
      @drop.stop="drop_handler"
    />
  </el-container>
</template>
<script>
import PanelLeft from './PanelLeft'
import PanelRight from './PanelRight'
import PanelTop from './PanelTop'
import ZoomSlider from './ZoomSlider'
// default BPMN graph
import diagramXML from '../../resources/diagram.bpmn'
import Diagram from '../Diagram'
export default {
  components: {
    ZoomSlider,
    PanelLeft,
    PanelRight,
    PanelTop,
  },
  // provide for child components inject the diagram object
  provide() {
    return {
      diagram: this.getDiagram,
      key: this.key,
    }
  },
  data() {
    return {
      key: Date.now(),
      diagram: undefined,
    }
  },
  created() {
    this.$store.commit('setCurrentKey', this.key)
  },
  mounted() {
    this.diagram = new Diagram(this.$refs.content, this.key)
    this.diagram.importXML(diagramXML)
  },
  activated() {
    this.$store.commit('setCurrentKey', this.key)
  },
  methods: {
    getDiagram() {
      return this.diagram
    },
    dragover_handler(event) {
      event.preventDefault()
    },
    drop_handler(event) {
      event.preventDefault()
      if (!this.diagram.draggingNode) {
        return
      }
      this.diagram.createNode(
        this.diagram.draggingNode,
        event.offsetX,
        event.offsetY
      )
      this.diagram.setDraggingNode(null)
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
