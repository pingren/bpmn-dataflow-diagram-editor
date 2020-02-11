<template>
  <div id="app">
    <el-container>
      <PaneLeft />
      <PaneTop />
      <PaneRight />
      <ZoomSlider style="position:absolute; bottom:100px;left: 300px;" />
      <DiagramEditor style="height:calc(100vh - 25px);width:100%;" />
    </el-container>
  </div>
</template>

<script>
import PaneLeft from './components/panel-left'
import PaneRight from './components/panel-right'
import PaneTop from './components/panel-top'
import ZoomSlider from './components/ZoomSlider'
import DiagramEditor from './components/DiagramEditor.vue'

export default {
  name: 'App',
  components: {
    DiagramEditor,
    ZoomSlider,
    PaneLeft,
    PaneRight,
    PaneTop,
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
