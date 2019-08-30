<template>
  <el-form
    v-if="props"
    style="padding:20px"
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
        let el = this.value
        if (el) {
          el = Object.assign(el, this.form)
        }
      },
      deep: true,
    },
    'value.di.id': {
      handler(value) {
        this.form = Object.assign({}, this.value)
        delete this.form.$type
        delete this.form.di
      },
      immediate: true,
    },
  },
}
</script>
