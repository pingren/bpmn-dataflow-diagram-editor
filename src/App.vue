<template>
  <div id="app">
    <el-container>
      <PanelLeft />
      <PanelTop />
      <PanelRight />
      <ZoomSlider style="position:absolute; bottom:100px;left: 300px;" />
      <DiagramEditor style="height:calc(100vh - 25px);width:100%;" />
    </el-container>
  </div>
</template>

<script>
import PanelLeft from './components/PanelLeft'
import PanelRight from './components/PanelRight'
import PanelTop from './components/PanelTop'
import ZoomSlider from './components/ZoomSlider'
import DiagramEditor from './components/DiagramEditor.vue'

export default {
  name: 'App',
  components: {
    DiagramEditor,
    ZoomSlider,
    PanelLeft,
    PanelRight,
    PanelTop,
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
