import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App.vue'
// import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'

Vue.use(ElementUI, {
  locale,
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
