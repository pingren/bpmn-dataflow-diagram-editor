<template>
  <el-tree
    :data="data"
    node-key="id"
    default-expand-all
    draggable
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    @node-drag-start="handleDragStart"
  />
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: 'mathout 算子',
          children: [
            {
              id: 4,
              label: '分类',
              children: [
                {
                  id: 9,
                  label: '朴素贝叶斯',
                },
                {
                  id: 10,
                  label: '逻辑回归',
                },
              ],
            },
            {
              id: 2,
              label: '聚类',
              children: [
                {
                  id: 5,
                  label: 'K均值',
                },
                {
                  id: 6,
                  label: 'Canopy算法',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: '预处理',
          children: [
            {
              id: 5,
              label: '采样',
            },
            {
              id: 6,
              label: '特征选择',
            },
          ],
        },
        {
          id: 3,
          label: '后处理',
          children: [
            {
              id: 7,
              label: '合并数据源和结果数据',
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  methods: {
    handleDragStart(node, ev) {
      console.log('drag start', node)
      window.draggingNode = node
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
