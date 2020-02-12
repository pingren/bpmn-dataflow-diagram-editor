<template>
  <div id="app">
    <el-tabs
      v-model="tabName"
      type="card"
      addable
      :closable="tabArray.length > 1"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="(item) in tabArray"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <keep-alive>
          <DiagramEditor v-if="item.name === tabName" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DiagramEditor from './components/DiagramEditor'
export default {
  name: 'App',
  components: {
    DiagramEditor,
  },
  data() {
    return {
      tabName: '0',
      tabArray: [
        {
          title: 'Project *',
          name: '0',
        },
      ],
    }
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = String(Date.now())
        this.tabArray.push({
          title: 'Project *',
          name: newTabName,
        })
        this.tabName = newTabName
      }
      if (action === 'remove') {
        let activeName = this.tabName
        let tabs = this.tabArray
        if (activeName === targetName) {
          let index = tabs.findIndex(tab => tab.name === activeName)
          if (index) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        }
        this.tabName = activeName
        this.tabArray = tabs.filter(tab => tab.name !== targetName)
      }
    },
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
