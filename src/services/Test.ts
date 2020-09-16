import request from '@/utils/request';

/**
 * 测试
 */
export async function getTest() {
  return request(`/api/test`);
}
