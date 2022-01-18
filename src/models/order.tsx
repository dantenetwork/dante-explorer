import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

const namespace = 'order';
// export const namespace_shop = namespace;

interface ModelState {
  name: string;
}

interface ModelsType {
  namespace: typeof namespace;
  state: ModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    update: Reducer<ModelState>;
    // 启用 immer 之后
    // update: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const ShopModels: ModelsType = {
  namespace, // 表示在全局 state 上的 key
  state: {
    // 状态数据
    name: '你好',
  },
  effects: {
    // 管理异步操作，采用了 generator 的相关概念
    *query({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: { name: '慧慧' },
      });
    },
  },
  reducers: {
    // 管理同步方法，必须是纯函数
    update(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    // 订阅数据源
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/shop') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
};

export default ShopModels;
