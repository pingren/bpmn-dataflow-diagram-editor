<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <el-container>
      <PaneLeft />
      <BPMNEditor
        style="height:100vh;width:100%;"
        @node-click="nodeClick"
        @run="run"
      />
      <PaneRight
        v-model="currentNode"
        :operator-config="currentConfig"
        :activities="activities"
      />
    </el-container>
  </div>
</template>

<script>
import PaneLeft from './components/PaneLeft'
import PaneRight from './components/PaneRight'
import BPMNEditor from './components/BPMNEditor.vue'

import { operatorList } from './mock.js'
import { setTimeout } from 'timers'

export default {
  name: 'App',
  components: {
    BPMNEditor,
    PaneLeft,
    PaneRight,
  },
  data: function() {
    return {
      currentConfig: undefined,
      currentNode: undefined,
      activities: [],
    }
  },
  methods: {
    nodeClick(node) {
      // console.log(node)
      this.currentNode = node
      if (node.id) {
        let operator = operatorList.find(item => item.id === node.id)
        if (operator) {
          this.currentConfig = operator
        } else {
          this.currentConfig = undefined
        }
      }
    },
    run() {
      this.activities = []
      let activities = [
        {
          content: 'Hadoop 数据源运行成功',
          timestamp: '2019-04-01 20:46',
          size: 'large',
          type: 'success',
          icon: 'el-icon-success',
        },
        {
          content: '贝叶斯分类算子正在运行',
          timestamp: '2019-04-01 20:47',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more',
        },
        {
          content: '工程配置有误',
          timestamp: '2019-04-01 20:48',
          size: 'large',
          type: 'warning',
          icon: 'el-icon-warning',
        },
        {
          content: '停止工程运行',
          timestamp: '2019-04-01 20:49',
          size: 'large',
          type: 'danger',
          icon: 'el-icon-error',
        },
      ]
      activities.forEach((item, index) => {
        setTimeout(() => {
          this.activities.push(item)
        }, (index + 1) * 2000)
      })
    },
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
