import { Effect, Reducer, Subscription } from 'umi';
import {
  getConfigOptions,
  saveConfig,
  getAnalyticsData,
} from '@/services/Analytics';
import { HotTopic } from '@/pages/topic/analytics';

export interface AnalyticsDataSourceConfig {
  name: string;
  from_date: string;
  to_date: string;
}

export interface AnalyticsConfigOptions {
  success?: boolean;
  datasources: string[];
  indicators: string[];
}

export interface AnalyticsConfig {
  project_id: string;
  keyword: string;
  datasources: AnalyticsDataSourceConfig[];
  indicators: string[];
}

export interface AnalyticsData {
  general: {
    //讨论量
    title: string;
    brand_color: string;
    total_all: number;
    total_week: number;
  }[];
  hot_topic: HotTopic;
}

export interface AnalyticsModelState {
  test: string;
  analyticsConfigOptions: AnalyticsConfigOptions | null;
  analyticsData: AnalyticsData | null;
}

export interface AnalyticsModelType {
  namespace: string;
  state: AnalyticsModelState;
  reducers: {
    save: Reducer<AnalyticsModelState>;
  };
  effects: {
    getConfigOptions: Effect;
    saveConfig: Effect;
    getData: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const AnalyticsModel: AnalyticsModelType = {
  namespace: 'analytics',
  state: {
    test: 'hello',
    analyticsData: null,
    analyticsConfigOptions: null,
  },
  effects: {
    *getConfigOptions(action, effects) {
      const { payload, type } = action;
      const { call, put } = effects;
      const response = yield call(getConfigOptions, payload);
      yield put({
        type: 'save',
        payload: {
          analyticsConfigOptions: response as AnalyticsDataSourceConfig,
        },
      });
    },
    *saveConfig(action, effects) {
      const { payload, type, callback } = action;
      const { call, put } = effects;
      const response = yield call(saveConfig, payload);
      callback && callback(response);
    },
    *getData(action, effects) {
      const { payload, type, callback } = action;
      const { call, put } = effects;
      const response = yield call(getAnalyticsData, payload.id);
      yield put({
        type: 'save',
        payload: {
          analyticsData: response.data as AnalyticsData,
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
