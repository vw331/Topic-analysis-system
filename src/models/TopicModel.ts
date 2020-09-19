import { Effect, Reducer, Subscription } from 'umi';
import { getTopics, getTopic, addTopic, delTopic } from '@/services/Topic';

export type TopicStatus = 'idle' | 'analysising' | 'ok';

export interface Topic {
  project_id: string;
  name: string;
  author: string;
  create_date: string;
  status: TopicStatus;
}

export interface NewTopic {
  name: string;
}

export interface NewTopicResponse {
  isSuccess: boolean;
  proj_id?: number;
}

export interface DelTopicResponse {
  isSuccess: boolean;
  msg?: string;
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
  topic: Topic | null;
}

export interface TopicModelType {
  namespace: string;
  state: TopicModelState;
  reducers: {
    save: Reducer<TopicModelState>;
  };
  effects: {
    getTopicList: Effect;
    getTopic: Effect;
    addTopic: Effect;
    delTopic: Effect;
  };
}

const TopicModel: TopicModelType = {
  namespace: 'topic',
  state: {
    topics: null,
    topic: null,
  },
  effects: {
    *getTopicList(action, effects) {
      const { payload } = action;
      const { call, put } = effects;
      const response = yield call(getTopics, payload);
      yield put({
        type: 'save',
        payload: { topics: response as Pageable },
      });
    },
    *getTopic(action, effects) {
      const { payload } = action;
      const { call, put } = effects;
      const response = yield call(getTopic, payload);
      yield put({
        type: 'save',
        payload: { topic: response as Topic },
      });
    },
    *addTopic(action, effects) {
      const { payload, callback } = action;
      const { call, put } = effects;
      const response: NewTopicResponse = yield call(addTopic, payload);
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
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default TopicModel;
