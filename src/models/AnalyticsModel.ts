import { Effect, Reducer, Subscription } from 'umi';
import { getConfigOptions } from '@/services/Analytics';

export interface AnalyticsDataSourceConfig {
  name: string;
  from_date: string;
  to_date: string;
}

export interface AnalyticsConfigOptions {
  success: boolean;
  datasources: string[];
  indicators: string[];
}

export interface AnalyticsConfig {
  project_id: string;
  keyword: string;
  datasource: AnalyticsDataSourceConfig[];
  indicators: string[];
}

export interface AnalyticsModelState {
  test: string;
  analyticsConfigOptions: AnalyticsConfigOptions | null;
  analyticsConfig: AnalyticsConfig | null;
}

export interface AnalyticsModelType {
  namespace: string;
  state: AnalyticsModelState;
  reducers: {
    save: Reducer<AnalyticsModelState>;
  };
  effects: {
    getConfigOptions: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const AnalyticsModel: AnalyticsModelType = {
  namespace: 'analytics',
  state: {
    test: 'hello',
    analyticsConfigOptions: null,
    analyticsConfig: null,
  },
  effects: {
    *getConfigOptions(action, effects) {
      const { payload, type } = action;
      const { call, put } = effects;
      const response = yield call(getConfigOptions, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          analyticsConfigOptions: response as AnalyticsDataSourceConfig,
        },
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
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'getConfigOptions',
      });
    },
  },
};

export default AnalyticsModel;
