<template>
  <el-form
    v-if="props"
    :key="currentNode.id"
    style="padding:0 20px; overflow:auto;"
    label-position="right"
    label-width="100px"
    :model="form"
  >
    <el-form-item
      v-for="(item,index) in props"
      :key="index"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.prop]"
      />
      <el-select
        v-if="['select','mselect'].indexOf(item.type) !== -1"
        v-model="form[item.prop]"
        :multiple="item.type === 'mselect'"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex'

import { operatorList } from '../../mock.js'
export default {
  props: {
    value: {
      type: Object,
      default: undefined,
    },
  },
  data: function() {
    return {
      form: {},
    }
  },
  computed: {
    ...mapGetters(['currentNode']),
    props() {
      if (this.currentNode && this.currentNode.$attrs.ID) {
        let config = operatorList.find(
          item => String(item.id) === String(this.currentNode.$attrs.ID)
        )
        return config ? config.props : undefined
      }
      return undefined
    },
  },
  watch: {
    form: {
      handler(before, after) {
        if (this.currentNode) {
          // for (let [key, value] of Object.entries(this.form)) {
          //   this.value.set(key, value)
          // }
          this.currentNode.set('PROPERTY', JSON.stringify(this.form))
        }
      },
      deep: true,
    },
    // switch to a diffrent node
    'currentNode.id': {
      handler() {
        if (this.currentNode) {
          if (this.currentNode.$attrs.PROPERTY) {
            this.form = Object.assign(
              {},
              JSON.parse(this.currentNode.$attrs.PROPERTY)
            )
          } else {
            this.form = Object.assign({}, undefined)
          }
        }
      },
      immediate: true,
    },
  },
}
</script>
