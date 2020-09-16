import { Request, Response } from 'express';
import { Topic, Pageable } from '@/models/TopicModel';

const sleep = (time: number = 2000) =>
  new Promise(resolve => setTimeout(resolve, time));

const getRandom = (start: number, end: number, fixed = 0): number => {
  let differ = end - start;
  let random = Math.random();
  return parseInt((start + differ * random).toFixed(fixed));
};

export default {
  'GET /api/test': { msg: 'hello this is test' },
  'POST /api/topics': async (req: Request, res: Response) => {
    await sleep(1000);
    res.send({
      success: true,
      msg: '创建成功!',
    });
  },
  'DELETE /api/topics/:id': async (req: Request, res: Response) => {
    const { id } = req.params;
    await sleep(1000);
    res.send({
      success: true,
      msg: '删除成功!',
    });
  },
  'GET /api/topics': async (req: Request, res: Response) => {
    const { current = '1', pageSize = '20' } = req.query;
    const topic: Topic = {
      project_id: '0',
      project_name: '名称',
      project_author: '张三',
      create_time: '2020-09-12',
      project_status: 1,
    };

    const records: Topic[] = new Array(20).fill(topic).map((item, index) => {
      return {
        ...item,
        project_status: getRandom(1, 3),
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
};
