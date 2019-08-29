<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <PaneLeft />
      <BPMNEditor
        style="height:100vh;width:100%;"
        @node-click="nodeClick"
      />
      <PaneRight />
    </el-container>
  </div>
</template>

<script>
import PaneLeft from './components/PaneLeft'
import PaneRight from './components/PaneRight'

import BPMNEditor from './components/BPMNEditor.vue'

// import './app.js'

export default {
  name: 'App',
  components: {
    BPMNEditor,
    PaneLeft,
    PaneRight,
  },
  methods: {
    nodeClick(node) {
      console.log(node)
    },
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
