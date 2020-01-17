<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <PaneLeft />
      <PaneTop />
      <PaneRight :activities="activities" />
      <BPMNEditor style="height:calc(100vh - 25px);width:100%;" />
    </el-container>
  </div>
</template>

<script>
import PaneLeft from './components/panel-left'
import PaneRight from './components/panel-right'
import PaneTop from './components/panel-top'

import BPMNEditor from './components/BPMNEditor.vue'

export default {
  name: 'App',
  components: {
    BPMNEditor,
    PaneLeft,
    PaneRight,
    PaneTop,
  },
  data: function() {
    return {
      currentConfig: undefined,
      currentNode: undefined,
      activities: [],
    }
  },
  methods: {
    run() {
      // this.activities = []
      // let activities = [
      //   {
      //     content: 'A completed!',
      //     timestamp: '2019-04-01 20:46',
      //     size: 'large',
      //     type: 'success',
      //     icon: 'el-icon-success',
      //   },
      //   {
      //     content: 'B is running',
      //     timestamp: '2019-04-01 20:47',
      //     size: 'large',
      //     type: 'primary',
      //     icon: 'el-icon-more',
      //   },
      //   {
      //     content: 'Config errors',
      //     timestamp: '2019-04-01 20:48',
      //     size: 'large',
      //     type: 'warning',
      //     icon: 'el-icon-warning',
      //   },
      //   {
      //     content: 'Stop running',
      //     timestamp: '2019-04-01 20:49',
      //     size: 'large',
      //     type: 'danger',
      //     icon: 'el-icon-error',
      //   },
      // ]
      // activities.forEach((item, index) => {
      //   setTimeout(() => {
      //     this.activities.push(item)
      //   }, (index + 1) * 2000)
      // })
    },
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
