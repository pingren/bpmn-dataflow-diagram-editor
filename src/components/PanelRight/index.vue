<template>
  <el-card
    class="left-pane"
    :body-style="{ padding:'0' }"
  >
    <el-menu
      :default-openeds="['1','2','3','4']"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <el-button
        :icon="isCollapse ? 'el-icon-bottom-left' : 'el-icon-top-right'"
        size="mini"
        plain
        style="border:none;width:100%;"
        title="折叠/展开"
        @click="isCollapse = !isCollapse"
      />
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document" />
          <span slot="title">Operator Info
          </span>
        </template>
        <div
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(20vh - 51px);'"
        >
          <PaneNodeInfo />
        </div>
      </el-submenu>
      <el-submenu
        v-if="currentNodeId"
        index="2"
      >
        <template slot="title">
          <i class="el-icon-edit-outline" />
          <span slot="title">Property
          </span>
        </template>
        <el-menu-item-group
          class="submenu"
          :style="
            isCollapse ? 'max-height: 90vh;' : 'max-height: calc(40vh - 35px);'
          "
        >
          <keep-alive>
            <PaneProperty :key="currentNodeId" />
          </keep-alive>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-card>
</template>

<script>
import PaneProperty from './PaneProperty'
import PaneNodeInfo from './PaneNodeInfo'
export default {
  inject: ['key'],
  components: {
    PaneProperty,
    PaneNodeInfo,
  },
  data() {
    return {
      isCollapse: false,
    }
  },
  computed: {
    state() {
      return this.$store.state[this.key]
    },
    currentNodeId() {
      return this.state.currentNodeId
    },
  },
}
</script>

<style scoped>
.left-pane {
  position: absolute;
  z-index: 9;
  right: 0;
  top: 0;
  max-height: 100vh;
  opacity: 0.9;
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
.list-enter-active,
.list-leave-active {
  transition: opacity 1s;
}
.list-enter {
  opacity: 0;
}
</style>
