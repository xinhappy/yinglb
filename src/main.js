// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'api/request'
import store from './store'
import 'common/less/base.less'

Vue.config.productionTip = false
Vue.prototype.QC = window.QC

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: h => h(App)
})
