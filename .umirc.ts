import { defineConfig } from 'umi';

export default defineConfig({
  title: 'hi',
  base: process.env.NODE_ENV === 'production' ? '/private/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  locale: { antd: true },
  nodeModulesTransform: {
    type: 'none',
  },
  links: [{ rel: 'shortcut icon', href: 'favicon.ico' }],
  favicon: 'favicon.ico',
  dynamicImport: {
    loading: '@/Loading',
  },
  routes: [
    {
      path: '/',
      component: '@/layout/common',
      routes: [
        { path: '/', component: '@/pages/home/home', title: 'Home' },
        {
          path: '/center',
          component: '@/pages/user/center',
          title: '个人中心',
          wrappers: ['@/wrappers/auth'],
        },
        { path: '/login', component: '@/pages/user/login', title: '登录' },
        { path: '/order', component: '@/pages/order/order', title: '订单列表' },
        {
          path: '/order/detail',
          component: '@/pages/order/detail',
          title: '订单详情',
        },
        {
          path: '/order/post',
          component: '@/pages/order/post',
          title: '发布订单',
        },

        {
          path: '/storage',
          component: '@/pages/storage/node',
          title: '存储节点',
        },
        {
          path: '/storage/detail',
          component: '@/pages/storage/detail',
          title: '存储节点详情',
        },
        { component: '@/pages/404', title: '404' },
      ],
    },
  ],
  dva: {
    // 配置自己需要的设置即可
    immer: true,
    hmr: true,
  },
  // mfsu: {}, //热更新
  // cssModulesTypescriptLoader: {},
  fastRefresh: {}, //快速刷新
  // proxy: {//代理
  //   '/api': {
  //     'target': 'http://jsonplaceholder.typicode.com/',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/api' : '' },
  //   },
  // },
});
