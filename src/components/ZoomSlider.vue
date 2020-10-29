<template>
  <el-slider
    v-if="zoomLevel"
    v-model="innerValue"
    class="slider"
    :step="0.001"
    :min="0.2"
    :max="4"
    :format-tooltip="val => `${ (val * 100).toFixed(0) }%` "
    vertical
    height="200px"
    @input="slide"
  />
</template>
<script>
fail test
export default {
  inject: ['diagram', 'key'],
  data: function() {
    return {
      innerValue: undefined,
    }
  },
  computed: {
    zoomLevel() {
      return this.$store.state[this.key].zoomLevel
    },
  },
  watch: {
    zoomLevel() {
      this.innerValue = this.zoomLevel
    },
  },
  methods: {
    slide(val) {
      this.diagram().canvas.zoom(val)
    },
  },
}
</script>
<style lang="scss" scoped>
.slider {
  z-index: 1;
  padding: 10px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  &:active {
    background: rgba(228, 228, 228, 0.4);
    border-color: rgba(128, 128, 128, 0.3);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
