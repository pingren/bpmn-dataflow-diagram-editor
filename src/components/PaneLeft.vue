<template>
  <el-card
    class="left-pane"
    :body-style="{ padding:'0', }"
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
          <span slot="title">第一步：数据源
          </span>
        </template>
        <DatabasePicker
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(30vh - 51px);'"
        />
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-magic-stick" />
          <span slot="title">第二步：选择算子
          </span>
        </template>
        <OperatorPicker
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(70vh - 35px);'"
        />
      </el-submenu>
    </el-menu>
  </el-card>
</template>

<script>
import OperatorPicker from './OperatorPicker'
import DatabasePicker from './DatabasePicker'

export default {
  components: {
    OperatorPicker,
    DatabasePicker,
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
/deep/ .el-submenu__title {
  height: 2.5em;
  line-height: 2.5em;
  background-color: #eff5ff;
  text-align: left;
}
/deep/ .el-menu:not(.el-menu--collapse) {
  width: 300px;
}
.submenu {
  overflow: auto;
  max-width: 500px;
}
</style>
