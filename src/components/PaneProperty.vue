<template>
  <el-form
    v-if="props"
    :key="value.id"
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
export default {
  props: {
    config: {
      type: Object,
      default: undefined,
    },
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
    props() {
      return this.config ? this.config.props : undefined
    },
  },
  watch: {
    form: {
      handler(before, after) {
        if (this.value) {
          // for (let [key, value] of Object.entries(this.form)) {
          //   this.value.set(key, value)
          // }
          this.value.set('PROPERTY', JSON.stringify(this.form))
        }
      },
      deep: true,
    },
    'value.id': {
      handler() {
        console.log('changed')
        if (this.value.$attrs.PROPERTY) {
          this.form = Object.assign({}, JSON.parse(this.value.$attrs.PROPERTY))
        } else {
          this.form = Object.assign({}, undefined)
        }
      },
      immediate: true,
    },
  },
}
</script>
