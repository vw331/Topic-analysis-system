import { defineConfig } from 'umi';

export default defineConfig({
  title: '你好呀',
  layout: {
    name: '社交媒体话题分析',
    locale: false,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      title: 'Home',
      component: '@/pages/index',
      menu: {
        name: '首页',
        icon: 'HomeOutlined',
      },
    },
    {
      page: '/topic',
      title: '话题',
      component: '@/pages/topic/index',
      menu: {
        name: '话题',
        icon: 'HomeOutlined',
      },
    },
  ],
  dva: {
    immer: true,
    hmr: false,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  links: [
    {
      href: 'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css',
      rel: 'stylesheet',
    },
  ],
});
