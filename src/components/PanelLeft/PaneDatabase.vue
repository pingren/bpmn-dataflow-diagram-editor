<template>
  <el-tree
    :data="data"
    node-key="ID"
    default-expand-all
    draggable
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    @node-drag-start="handleDragStart"
  />
</template>

<script>
export default {
  inject: ['diagram'],
  data() {
    return {
      data: [
        {
          ID: 1,
          label: 'DataSource A',
        },
        {
          ID: 2,
          label: 'DataSource B',
        },
        {
          ID: 3,
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
