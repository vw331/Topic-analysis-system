import { Request, Response } from 'express';
import { Topic, Pageable, TopicStatus } from '@/models/TopicModel';

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
    res.send({
      isSuccess: true,
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
};
