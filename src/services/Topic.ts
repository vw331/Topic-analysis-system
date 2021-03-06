import request from '@/utils/request';

export interface TopicParams {
  current: number;
  pageSize: number;
}

// 获取话题列表
export async function getTopics(
  params: TopicParams = {
    current: 1,
    pageSize: 20,
  },
) {
  return request(`/api/project_list`, {
    params: params,
  });
}

export interface TopicBody {
  project_name: string;
}

// 创建话题
export async function addTopic(body: TopicBody) {
  return request('/api/new_project', {
    method: 'POST',
    data: body,
  });
}

// 删除话题
export async function delTopic(id: string) {
  return request(`/api/del_project/${id}`);
}

// 获取话题
export async function getTopic(id: string) {
  return request(`/api/project/${id}`);
}
