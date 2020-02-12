<template>
  <p style="text-align: left;padding:0 1em;">
    {{ description }}
  </p>
</template>
<script>
import { operatorList } from '../../mock.js'
export default {
  inject: ['diagram', 'key'],
  computed: {
    currentNodeId() {
      return this.$store.state[this.key].currentNodeId
    },
    currentNode() {
      return this.currentNodeId
        ? this.diagram().getNodeById(this.currentNodeId)
        : undefined
    },
    description() {
      if (this.currentNode && this.currentNode.$attrs.ID) {
        let config = operatorList.find(
          item => String(item.id) === String(this.currentNode.$attrs.ID)
        )
        return config ? config.description : 'No Info'
      }
      return 'No Info'
    },
  },
}
</script>
