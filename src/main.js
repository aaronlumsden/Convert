import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'reset-css';
import 'fuse.js'
Vue.config.productionTip = false

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import Snotify from 'vue-snotify'; // 1. Import Snotify
import "vue-snotify/styles/material.css"
Vue.use(Snotify)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
