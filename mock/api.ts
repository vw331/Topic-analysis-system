import { Request, Response } from 'express';
import {
  Topic,
  TopicInfo,
  Pageable,
  TopicStatus,
  NewTopicResponse,
  DelTopicResponse,
} from '@/models/TopicModel';
import {
  AnalyticsDataSourceConfig,
  AnalyticsConfigOptions,
  AnalyticsConfig,
  AnalyticsData,
} from '@/models/AnalyticsModel';
import { HotTopic, ChangingTrend, HotMessage } from '@/pages/topic/analytics';
import request from '@/utils/request';
const word_cloud = require('./word_cloud.json');

const sleep = (time: number = 2000) =>
  new Promise(resolve => setTimeout(resolve, time));

const getRandom = (start: number, end: number, fixed = 0): number => {
  let differ = end - start;
  let random = Math.random();
  return parseInt((start + differ * random).toFixed(fixed));
};

export default {
  'GET /api/test': { msg: 'hello this is test' },
  'POST /api/new_project': async (req: Request, res: Response) => {
    await sleep(1000);
    const result: NewTopicResponse = { isSuccess: true, proj_id: 123 };
    res.send(result);
  },
  'GET /api/del_project/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(1000);
    const result: DelTopicResponse = { isSuccess: true };
    res.send(result);
  },
  'GET /api/project_list': async (req: Request, res: Response) => {
    const { current = '1', pageSize = '20' } = req.query;
    const statusArr: TopicStatus[] = ['idle', 'analysising', 'ok'];
    const topic: Topic = {
      project_id: '0',
      name: '名称',
      author: '张三',
      create_date: '2020-09-12',
      status: 'idle',
    };

    const records: Topic[] = new Array(20).fill(topic).map((item, index) => {
      return {
        ...item,
        status: statusArr[getRandom(0, 2)],
        project_id:
          'PK_' +
          ((parseInt(current as string) - 1) * parseInt(pageSize as string) +
            index +
            1),
      };
    });

    const result: Pageable = {
      pagination: {
        current: parseInt(current as string),
        pageSize: 20,
        total: 100,
      },
      data: records,
    };
    await sleep(2000);
    res.send(result);
  },
  'GET /api/project/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(2000);
    const result: TopicInfo = {
      data: {
        project: {
          project_id: id,
          name: '测试专用',
          author: 'sunhao',
          create_date: '2020-03-13',
          status: 'ok',
        },
        config: {
          datasources: [
            {
              from_date: '2020-06-01',
              name: 'bilibili',
              to_date: '2020-08-08',
            },
            {
              from_date: '2020-06-01',
              name: '微博',
              to_date: '2020-08-08',
            },
          ],
          indicators: ['热度', '基本用户画像', '话题聚类'],
          keyword: 'AR',
          project_id: '3',
        },
      },
      isExist: true,
    };
    res.send(result);
  },
  'GET /api/configs': async (req: Request, res: Response) => {
    await sleep(2000);
    const result: AnalyticsConfigOptions = {
      success: true,
      datasources: ['bilibili', '知乎', '微博'],
      indicators: ['话题热度', '主要观点', '用户态度', '用户画像'],
    };
    res.send(result);
  },
  'POST /api/update_config': async (req: Request, res: Response) => {
    await sleep(200);
    res.send({ isSuccess: true });
  },
  'GET /api/report/:id': async (req: Request, res: Response) => {
    await sleep(200);

    const result: AnalyticsData = {
      general: [
        {
          title: '讨论量总计',
          brand_color: 'black',
          total_all: 345243,
          total_week: 2345,
        },
        {
          title: 'B站讨论量',
          brand_color: 'blue',
          total_all: 24235,
          total_week: 2345,
        },
        {
          title: '微博讨论量',
          brand_color: 'red',
          total_all: 24235,
          total_week: 2345,
        },
        {
          title: '知乎讨论量',
          brand_color: 'blue',
          total_all: 24235,
          total_week: 2345,
        },
      ],
      hot_topic: [
        {
          name: 'b站',
          value: 653,
          time: '1月',
        },
        {
          name: 'b站',
          value: 231,
          time: '2月',
        },
        {
          name: 'b站',
          value: 124,
          time: '3月',
        },
        {
          name: 'b站',
          value: 756,
          time: '4月',
        },
        {
          name: 'b站',
          value: 54,
          time: '5月',
        },
        {
          name: 'b站',
          value: 986,
          time: '6月',
        },
        {
          name: '微博',
          value: 234,
          time: '1月',
        },
        {
          name: '微博',
          value: 65,
          time: '2月',
        },
        {
          name: '微博',
          value: 345,
          time: '3月',
        },
        {
          name: '微博',
          value: 123,
          time: '4月',
        },
        {
          name: '微博',
          value: 765,
          time: '5月',
        },
        {
          name: '微博',
          value: 433,
          time: '6月',
        },
      ],
      hot_topic_ranking: [
        '工专路0号',
        '工专路1号',
        '工专路2号',
        '工专路3号',
        '工专路4号',
        '工专路5号',
        '工专路6号',
      ],
      changing_trend: [
        {
          name: '18周岁以下',
          time: '2017年',
          value: 123,
        },
        {
          name: '18周岁24周岁',
          time: '2017年',
          value: 234,
        },
        {
          name: '24周岁-36周岁',
          time: '2017年',
          value: 431,
        },
        {
          name: '36周岁以上',
          time: '2017年',
          value: 21,
        },
        {
          name: '18周岁以下',
          time: '2018年',
          value: 43,
        },
        {
          name: '18周岁24周岁',
          time: '2018年',
          value: 234,
        },
        {
          name: '24周岁-36周岁',
          time: '2018年',
          value: 432,
        },
        {
          name: '36周岁以上',
          time: '2018年',
          value: 34,
        },
        {
          name: '18周岁以下',
          time: '2019年',
          value: 43,
        },
        {
          name: '18周岁24周岁',
          time: '2019年',
          value: 234,
        },
        {
          name: '24周岁-36周岁',
          time: '2019年',
          value: 432,
        },
        {
          name: '36周岁以上',
          time: '2019年',
          value: 34,
        },
      ],
      word_cloud: word_cloud,
      topic_relevance: [
        {
          name: 'java',
          value_x: 24,
          value_y: 28,
          rank: 243,
        },
        {
          name: 'javascript',
          value_x: 23,
          value_y: 89,
          rank: 193,
        },
        {
          name: 'typescript',
          value_x: 34,
          value_y: 98,
          rank: 124,
        },
      ],
      hot_message: (function() {
        const data: HotMessage[] = new Array(30)
          .fill({
            id: '1',
            title: '热门信息',
            source: '今日头条',
            create_time: '2020-02-12',
            reposted: 0,
          })
          .map((item, index) => ({
            ...item,
            id: index,
            title: item.title + index,
            reposted: Math.round(Math.random() * 1000),
          }));
        return data;
      })(),
      hot_netizen: [
        {
          tab: '知乎',
          key: '1',
          content: [
            {
              id: 1,
              name: '张三',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              describe: '发贴量: 145',
            },
            {
              id: 2,
              name: '李四',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              describe: '发贴量: 145',
            },
          ],
        },
        {
          tab: '微博',
          key: '2',
          content: [
            {
              id: 1,
              name: '王五',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              describe: '发贴量: 145',
            },
            {
              id: 2,
              name: '赵六',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              describe: '发贴量: 145',
            },
          ],
        },
      ],
      map_netizen: [
        {
          name: '江苏省',
          value: 92595,
        },
        {
          name: '澳门特别行政区',
          value: 1234,
        },
        {
          name: '浙江省',
          value: 56197.15,
        },
        {
          name: '山东省',
          value: 76469.67,
        },
        {
          name: '青海省',
          value: 2865.23,
        },
        {
          name: '重庆市',
          value: 20363.19,
        },
        {
          name: '福建省',
          value: 35804,
        },
      ],
      gender_type: [
        {
          type: '男',
          value: 234,
        },
        {
          type: '女',
          value: 335,
        },
        {
          type: '未知',
          value: 455,
        },
      ],
      comment_emotional_type: [
        {
          type: '愤怒',
          value: 345,
        },
        {
          type: '开心',
          value: 23,
        },
        {
          type: '嘲讽',
          value: 324,
        },
      ],
    };
    res.send({ isSuccess: true, data: result });
  },
};
