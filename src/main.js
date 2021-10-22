import Vue from 'vue';
import VueResource from 'vue-resource';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router.js';

Vue.use(VueResource);
Vue.config.productionTip = false;

new Vue({vuetify, router, render: h => h(App)}).$mount('#app');
