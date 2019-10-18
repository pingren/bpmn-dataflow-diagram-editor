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
          label: 'DataSource A',
        },
        {
          id: 2,
          label: 'DataSource B',
        },
        {
          id: 3,
          label: 'DataSource C',
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
      node.data.type = 'bpmn:ServiceTask'
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
