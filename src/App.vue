<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <PaneLeft />
      <BPMNEditor style="height:100vh;width:100%;" />
    </el-container>
  </div>
</template>

<script>
import PaneLeft from './components/PaneLeft'
import BPMNEditor from './components/BPMNEditor.vue'

// import './app.js'

export default {
  name: 'App',
  components: {
    BPMNEditor,
    PaneLeft,
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
