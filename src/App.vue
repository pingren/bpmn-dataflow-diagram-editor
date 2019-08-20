<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <el-aside>
        <el-card>
          <div slot="header">
            <span>第一步：选择数据源</span>
          </div>
          <DatabasePicker style="width:300px;" />
        </el-card>

        <el-card style="height: 50%">
          <div slot="header">
            <span>第二步：选择算子</span>
          </div>
          <OperatorPicker style="width:300px;" />
        </el-card>
      </el-aside>
      <BPMNEditor style="height:100vh;width:100%;" />
    </el-container>
  </div>
</template>

<script>
import OperatorPicker from './components/OperatorPicker'
import DatabasePicker from './components/DatabasePicker'

import BPMNEditor from './components/BPMNEditor.vue'

// import './app.js'

export default {
  name: 'App',
  components: {
    OperatorPicker,
    DatabasePicker,
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
