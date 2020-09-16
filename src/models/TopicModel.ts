import { Effect, Reducer, Subscription } from 'umi';
import { getTopics, addTopic, delTopic } from '@/services/Topic';

export interface Topic {
  project_id: string;
  project_name: string;
  project_author: string;
  create_time: string;
  project_status: number;
}

export interface Pageable {
  data: Topic[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export interface TopicModelState {
  topics: Pageable | null;
}

export interface TopicModelType {
  namespace: string;
  state: TopicModelState;
  reducers: {
    show: Reducer<TopicModelState>;
  };
  effects: {
    getTopicList: Effect;
    addTopic: Effect;
    delTopic: Effect;
  };
}

const TopicModel: TopicModelType = {
  namespace: 'topic',
  state: {
    topics: null,
  },
  effects: {
    *getTopicList(action, effects) {
      const { payload } = action;
      const { call, put } = effects;
      const response = yield call(getTopics, payload);
      yield put({
        type: 'show',
        payload: { topics: response as Pageable },
      });
    },
    *addTopic(action, effects) {
      const { payload, callback } = action;
      const { call, put } = effects;
      const response = yield call(addTopic, payload);
      callback && callback(response);
    },
    *delTopic(action, effects) {
      const { payload, callback } = action;
      const { call, put } = effects;
      const response = yield call(delTopic, payload);
      callback && callback(response);
    },
  },
  reducers: {
    show(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default TopicModel;
