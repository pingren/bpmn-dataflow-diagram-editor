<template>
  <p style="text-align: left;padding:0 1em;">
    {{ description }}
  </p>
</template>
<script>
import { mapGetters } from 'vuex'

import { operatorList } from '../../mock.js'
export default {
  computed: {
    ...mapGetters(['currentNode']),
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
