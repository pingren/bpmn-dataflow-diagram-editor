<template>
  <el-card
    class="left-pane"
    :body-style="{ padding:'0', }"
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
          <p style="text-align: left;padding:0 1em;">
            {{ operatorConfig ? operatorConfig.description : '' }}
          </p>
        </div>
      </el-submenu>
      <el-submenu index="2">
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
          <PaneProperty
            v-if="operatorConfig"
            :config="operatorConfig"
            :value="value"
          />
          <span
            v-else
            style="color:lightgrey;"
          >
            No Configruable Property</br></br>
          </span>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu
        v-if="activities && activities.length"
        index="3"
      >
        <template slot="title">
          <i class="el-icon-view" />
          <span slot="title">Progress
          </span>
        </template>
        <el-menu-item-group
          ref="activities"
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(40vh - 180px);'"
        >
          <el-timeline
            v-if="activities"
            style="padding-right:1em;"
          >
            <transition-group name="list">
              <el-timeline-item
                v-for="(activity) in activities"
                :key="activity.timestamp"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </transition-group>
          </el-timeline>
        </el-menu-item-group>
        </div>
      </el-submenu>
    </el-menu>
  </el-card>
</template>

<script>
import PaneProperty from './PaneProperty'
export default {
  components: {
    PaneProperty,
  },
  props: {
    value: {
      type: Object,
      default: undefined,
    },
    activities: {
      type: Array,
      default: undefined,
    },
    operatorConfig: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      isCollapse: false,
      radio: '1',
    }
  },
  watch: {
    activities() {
      if (this.activities && this.activities.length && this.$refs.activities) {
        let element = this.$refs.activities.$el
        this.$nextTick(() => {
          element.scrollTop = element.scrollHeight
        })
      }
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
}
/deep/ .el-submenu__title {
  height: 2.5em;
  line-height: 2.5em;
  background-color: #f3f9ef;
  text-align: left;
}
/deep/ .el-menu:not(.el-menu--collapse) {
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
