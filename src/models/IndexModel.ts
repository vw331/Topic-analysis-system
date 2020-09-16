import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import { getTest } from '@/services/Test';

export interface IndexModelState {
  name: string;
  test: any;
}

export interface IndexModelType {
  namespace: 'index';
  state: IndexModelState;
  effects: {
    test: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    show: Reducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'index',
  state: {
    name: 'sunhao',
    test: null,
  },
  effects: {
    *test(action, effects) {
      console.log(action, effects);
      const { payload } = action;
      const { call, put } = effects;
      const response = yield call(getTest, payload);
      yield put({
        type: 'show',
        payload: { test: response },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    show(state, action) {
      console.log(action);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
};

export default IndexModel;
