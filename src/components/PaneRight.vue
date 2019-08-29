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
          <span slot="title">算子说明
          </span>
        </template>
        <div
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(20vh - 51px);'"
        >
          <p style="text-align: left;padding:0 1em;">
            朴素贝叶斯是一种构建分类器的简单方法。该分类器模型会给问题实例分配用特征值表示的类标签，类标签取自有限集合。它不是训练这种分类器的单一算法，而是一系列基于相同原理的算法：所有朴素贝叶斯分类器都假定样本每个特征与其他特征都不相关。举个例子，如果一种水果其具有红，圆，直径大概3英寸等特征，该水果可以被判定为是苹果。尽管这些特征相互依赖或者有些特征由其他特征决定，然而朴素贝叶斯分类器认为这些属性在判定该水果是否为苹果的概率分布上独立的。
          </p>
        </div>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-edit-outline" />
          <span slot="title">属性
          </span>
        </template>
        <el-form :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(40vh - 35px);'" />
        <!-- <OperatorPicker
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(70vh - 35px);'"
        /> -->
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-view" />
          <span slot="title">工程运行进度
          </span>
        </template>
        <el-menu-item-group
          class="submenu"
          :style="isCollapse ? 'max-height: 90vh;' : 'max-height: calc(40vh - 146px);'"
        >
          <el-timeline style="padding-right:1em;">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-menu-item-group>
        </div>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-magic-stick" />
          <span slot="title">节点数据配置
          </span>
        </template>
        <el-form
          label-width="150px"
          size="mini"
        >
          <p style="text-align:center">
            <span>是否输出节点数据</br></span>
            <el-radio
              v-model="radio"
              label="1"
            >
              是
            </el-radio>
            <el-radio
              v-model="radio"
              label="2"
            >
              否
            </el-radio>
          </p>
        </el-form>
      </el-submenu>
    </el-menu>
  </el-card>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      isCollapse: false,
      radio: '1',
      activities: [
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
      ],
    }
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
