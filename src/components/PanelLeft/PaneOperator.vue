<template>
  <div>
    <el-input
      v-model="filterText"
      prefix-icon="el-icon-search"
      placeholder="算子名称"
      size="mini"
    />
    <el-tree
      ref="tree"
      :filter-node-method="filterNode"
      :data="data"
      node-key="ID"
      default-expand-all
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drag-start="handleDragStart"
    />
  </div>
  </div>
</template>

<script>
export default {
  inject: ['diagram'],
  data() {
    return {
      data: [
        {
          ID: 1,
          label: 'Operator 算子',
          children: [
            {
              ID: 4,
              label: 'Type 1',
              children: [
                {
                  ID: 9,
                  label: 'Naive Bayes classifier 朴素贝叶斯',
                },
                {
                  ID: 10,
                  label: 'Logistic regression 逻辑回归',
                },
              ],
            },
            {
              ID: 2,
              label: 'Type 2',
              children: [
                {
                  ID: 5,
                  label: 'K-means Clustering K均值',
                },
                {
                  ID: 6,
                  label: 'Canopy Clustering Canopy聚类',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      filterText: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label && data.label.indexOf(value) !== -1
    },
    handleDragStart(node, ev) {
      node.data.type = 'bpmn:ScriptTask'
      this.diagram().setDraggingNode(node)
    },
    allowDrop(draggingNode, dropNode, type) {
      return false
    },
    allowDrag(draggingNode) {
      return draggingNode.isLeaf
    },
  },
}
</script>
