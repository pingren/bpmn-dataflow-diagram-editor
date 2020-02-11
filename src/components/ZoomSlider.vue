<template>
  <el-slider
    v-if="zoomLevel"
    v-model="zoomLevel"
    :step="0.001"
    :min="0.2"
    :max="4"
    :format-tooltip="val => `${ (val*100).toFixed(0) }%` "
    vertical
    height="200px"
    @input="slide"
  />
</template>
<script>
import { canvas } from '../bpmn'

export default {
  computed: {
    zoomLevel: {
      get() {
        return this.$store.state.zoomLevel
      },
      set(val) {
        this.$store.commit('setZoomLevel', val)
      },
    },
  },
  methods: {
    slide(val) {
      canvas.zoom(val)
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
