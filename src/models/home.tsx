import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { get, post } from '@/utils/server';
import { api } from '@/config/apis';
const namespace = 'home';
// export const namespace_shop = namespace;

interface ModelState {
  loading: boolean;
  name: string;
  globalInfo: Object;
}

interface ModelsType {
  namespace: typeof namespace;
  state: ModelState;
  effects: {
    query: Effect;
    getglobalinfo: Effect;
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
    loading: false,
    name: '你好',
    globalInfo: {},
  },
  effects: {
    // 管理异步操作，采用了 generator 的相关概念
    *query({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: { name: '慧慧' },
      });
    },
    // 列表
    *getglobalinfo({ payload = {} }, { put, call }) {
      try {
        yield put({ type: 'update', payload: { loading: true } });
        debugger;
        const data = yield call(get(api.home.global_info), payload);
        console.log('66666666666666', data);
        yield put({
          type: 'update',
          payload: {
            list: data.list,
            total: data.total,
            loading: false,
          },
        });
        console.log(data.list);
      } catch (err) {
        console.log(err);
      }
    },
    // // 详情
    // * info ({payload = {}}, {put, call}) {
    //   console.log('>>>>>info')
    //   try {
    //     yield put({type: 'update', payload: {loading: true}})
    //     const res = yield call(app.apis.courier.info.doGet, payload)
    //     yield put('update', { courierData: res, loading: false })
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
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
