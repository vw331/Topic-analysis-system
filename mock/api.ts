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
import request from '@/utils/request';

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
  'GET /api/analytics_data/:id': async (req: Request, res: Response) => {
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
      hot_topic: {
        groupField: 'name',
        data: [
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
      },
    };
    res.send({ isSuccess: true, data: result });
  },
};
