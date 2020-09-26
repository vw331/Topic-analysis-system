import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    API_SERVER: 'http://nenkon.natapp1.cc',
  },
  title: '你好呀',
  base: process.env.BASE,
  layout: {
    name: '寻乌用户调查系统',
    locale: false,
    logo: false,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      redirect: '/topic',
    },
    {
      path: '/topic',
      exact: true,
      title: '话题',
      component: '@/pages/topic/index',
      menu: {
        name: '话题',
        icon: 'HomeOutlined',
      },
    },
    {
      path: '/topic/:id',
      title: '话题详情',
      component: '@/pages/topic/detail',
      layout: {
        hideMenu: true,
        hideNav: true,
      },
    },
  ],
  dva: {
    immer: true,
    hmr: true,
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
