// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from 'G:/lhc/dante-explorer/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/Loading';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layout__common' */'@/layout/common'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__home__home' */'@/pages/home/home'), loading: LoadingComponent}),
        "title": "Home",
        "exact": true
      },
      {
        "path": "/center",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__center' */'@/pages/user/center'), loading: LoadingComponent}),
        "title": "个人中心",
        "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/wrappers/auth'), loading: LoadingComponent})],
        "exact": true
      },
      {
        "path": "/login",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__login' */'@/pages/user/login'), loading: LoadingComponent}),
        "title": "登录",
        "exact": true
      },
      {
        "path": "/order",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__order' */'@/pages/order/order'), loading: LoadingComponent}),
        "title": "订单列表",
        "exact": true
      },
      {
        "path": "/order/detail/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__detail' */'@/pages/order/detail'), loading: LoadingComponent}),
        "title": "订单详情",
        "exact": true
      },
      {
        "path": "/order/post",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__order__post' */'@/pages/order/post'), loading: LoadingComponent}),
        "title": "发布订单",
        "exact": true
      },
      {
        "path": "/storage",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__storage__node' */'@/pages/storage/node'), loading: LoadingComponent}),
        "title": "存储节点",
        "exact": true
      },
      {
        "path": "/storage/detail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__storage__detail' */'@/pages/storage/detail'), loading: LoadingComponent}),
        "title": "存储节点详情",
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'@/pages/404'), loading: LoadingComponent}),
        "title": "404",
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
