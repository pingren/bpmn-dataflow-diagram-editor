<template>
  <el-card
    class="left-pane"
    :body-style="{ padding:'0' }"
  >
    <el-menu
      :default-openeds="['1','2']"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <el-button
        :icon="isCollapse ? 'el-icon-bottom-right' : 'el-icon-top-left'"
        size="mini"
        plain
        style="border:none;width:100%;"
        title="折叠/展开"
        @click="isCollapse = !isCollapse"
      />
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-coin" />
          <span slot="title">Datasource List
          </span>
        </template>
        <PaneDatabase
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(30vh - 51px);'"
        />
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-magic-stick" />
          <span slot="title">Operators Tree
          </span>
        </template>
        <PaneOperator
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(70vh - 35px);'"
        />
      </el-submenu>
    </el-menu>
  </el-card>
</template>

<script>
import PaneOperator from './PaneOperator'
import PaneDatabase from './PaneDatabase'

export default {
  components: {
    PaneOperator,
    PaneDatabase,
  },
  data() {
    return {
      isCollapse: false,
    }
  },
}
</script>

<style scoped>
.left-pane {
  position: absolute;
  z-index: 9;
  left: 0;
  top: 0;
  max-height: 100vh;
}
>>> .el-submenu__title {
  height: 2.5em;
  line-height: 2.5em;
  background-color: #f3f9ef;
  text-align: left;
}
>>> .el-menu:not(.el-menu--collapse) {
  width: 300px;
}
.submenu {
  overflow: auto;
  max-width: 500px;
}
</style>
