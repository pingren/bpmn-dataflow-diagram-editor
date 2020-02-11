<template>
  <div
    ref="content"
    style="width:100%;height:100%;"
    class="containers"
    @dragover.stop="dragover_handler"
    @drop.stop="drop_handler"
  />
</template>
<script>
// default BPMN graph
import diagramXML from '../../resources/diagram.bpmn'
import {
  createBpmnModeler,
  draggingNode,
  setDraggingNode,
  createNode,
  importXML,
} from '../bpmn'

export default {
  data() {
    return {
      drawerVisible: false,
      drawerContent: undefined,
    }
  },
  computed: {
    // ...mapState(['bpmnModeler', 'draggingNode', 'eventBus']),
    // ...mapGetters(['modeling', 'commandStack', 'canvas', 'cli']),
  },
  mounted() {
    createBpmnModeler(this.$refs.content)
    // imoprt default diagram
    importXML(diagramXML)
  },
  methods: {
    dragover_handler(event) {
      event.preventDefault()
    },
    drop_handler(event) {
      event.preventDefault()
      if (!draggingNode) {
        return
      }
      createNode(draggingNode, event.offsetX, event.offsetY)
      setDraggingNode(null)
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
