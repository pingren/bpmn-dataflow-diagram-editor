<template>
  <div>
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
// default BPMN graph
import diagramXML from '../../resources/diagram.bpmn'
import {
  bpmnModeler,
  createBpmnModeler,
  draggingNode,
  setDraggingNode,
  createNode,
} from './bpmn'

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
    bpmnModeler.importXML(diagramXML, err => {
      if (err) {
        console.error(err)
      }
    })
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
