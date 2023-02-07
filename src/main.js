import Vue from 'vue'

import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue';
import VueCookies from 'vue-cookies';
import './assets/main.css'

Vue.use(BootstrapVue);
Vue.use(VueCookies, { 
  expires: '1d', 
  path: '/', 
  domain: '', 
  secure: '', 
  sameSite: 'Lax' 
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
