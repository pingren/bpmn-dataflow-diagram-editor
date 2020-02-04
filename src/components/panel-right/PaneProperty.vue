<template>
  <el-form
    v-if="props"
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
        <template v-if="item.mode === 'input' && currentInput">
          <el-option
            v-for="option in currentInput[item.prop]"
            :key="option.value"
            :label="option.label"
            :value="option"
          />
        </template>
        <template>
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option"
          />
        </template>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex'
import { operatorList } from '../../mock.js'
import { eventBus } from '../bpmn'
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
    ...mapGetters(['currentNode', 'currentInput']),
    props() {
      if (this.currentNode && this.currentNode.$attrs.ID) {
        let config = operatorList.find(
          item => String(item.id) === String(this.currentNode.$attrs.ID)
        )
        return config ? config.props : undefined
      }
      return undefined
    },
    formJSON() {
      // 如果是数值则转换成字符串类型，使 JSON.stringify 格式统一不调用多次 watch
      return JSON.stringify(this.form, (key, value) =>
        isNaN(value) ? value : String(value)
      )
    },
  },
  watch: {
    formJSON: {
      handler(after, before) {
        if (before !== after) {
          // console.log('Modify Node Data:', before, '=>', after)
          if (this.currentNode) {
            // for (let [key, value] of Object.entries(this.form)) {
            //   this.value.set(key, value)
            // }
            this.currentNode.set('PROPERTY', this.formJSON)
            eventBus.fire('commandStack.changed', {
              businessObject: this.currentNode,
            })
          }
        }
      },
    },
  },
  // switch to a diffrent node, using vue keep-alive
  activated() {
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
  deactivated() {
    // console.log(this.currentNode.name)
  },
}
</script>
