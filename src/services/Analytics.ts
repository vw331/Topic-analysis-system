import request from '@/utils/request';

// 获取配置
export function getConfigOptions() {
  return request(`/api/configs`);
}
