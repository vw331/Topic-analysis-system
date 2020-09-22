import request from '@/utils/request';
import { AnalyticsConfig } from '@/models/AnalyticsModel';

// 获取配置项
export function getConfigOptions() {
  return request(`/api/configs`);
}

// 提交配置
export function saveConfig(body: AnalyticsConfig) {
  return request('/api/update_config', {
    method: 'POST',
    data: body,
  });
}

// 获取数据
export function getAnalyticsData(id: string) {
  return request(`/api/analytics_data/${id}`);
}
