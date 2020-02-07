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
        :value="form[item.prop]"
        @input="value => updateTransferModel(item.prop, value)"
      />
      <el-select
        v-if="['select','mselect'].indexOf(item.type) !== -1"
        :value="form[item.prop]"
        :multiple="item.type === 'mselect'"
        @input="value => updateTransferModel(item.prop, value)"
      >
        <template v-if="item.mode === 'input' && currentInput">
          <el-option
            v-for="option in currentInput[item.prop]"
            :key="option.value"
            :value-key="option.value"
            :label="option.label"
            :value="option"
          />
        </template>
        <template>
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :value-key="option.value"
            :label="option.label"
            :value="option"
          />
        </template>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState } from 'vuex'
import { operatorList } from '../../mock.js'
import { getNodeById } from '../bpmn'
export default {
  props: {
    value: {
      type: Object,
      default: undefined,
    },
  },
  data: function() {
    return {
      id: undefined,
    }
  },
  computed: {
    ...mapState(['currentNodeId', 'inputModel', 'transferModel']),
    currentNode() {
      return getNodeById(this.id)
    },
    currentInput() {
      return this.inputModel[this.id]
    },
    form: {
      get() {
        return this.transferModel[this.id]
      },
      set(value) {
        this.$store.commit('setTransfer', { id: this.id, obj: value })
      },
    },
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
  // switch to a diffrent node, using vue keep-alive
  activated() {
    if (this.currentNodeId) {
      this.id = this.currentNodeId
      if (this.form === undefined) {
        this.form = {}
      }
    }
  },
  deactivated() {
    // console.log(this.currentNode.name)
  },
  methods: {
    updateTransferModel(key, value) {
      this.$store.commit('setTransfer', { id: this.id, key, obj: value })
    },
  },
}
</script>
