<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <HelloWorld style="width:300px;" />
      <BPMNEditor style="height:100vh;width:100%;" />
    </el-container>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import BPMNEditor from './components/BPMNEditor.vue'

// import './app.js'

export default {
  name: 'App',
  components: {
    HelloWorld,
    BPMNEditor,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
