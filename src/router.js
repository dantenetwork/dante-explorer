
import Vue from 'vue';
import VueRouter from 'vue-router';

import deal from './components/Deal.vue';
import home from './components/Home.vue';
import provider from './components/Provider.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/home', component: home, name: 'home'},
  {path: '/deal/:dealId', component: deal, name: 'deal'},
  {path: '/provider/:providerPublicKey', component: provider, name: 'provider'},
  {path: '', redirect: 'home'}
];

const router = new VueRouter({routes});

export default router