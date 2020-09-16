import request from '@/utils/request';

interface topicParams {
  current: number;
  pageSize: number;
}

export async function getTopics(
  params: topicParams = {
    current: 1,
    pageSize: 20,
  },
) {
  return request(`/api/topics`, {
    params: params,
  });
}
