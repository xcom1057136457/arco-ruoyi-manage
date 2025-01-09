import { createRouter, createWebHistory } from 'vue-router'
import type { MyRouteRecordRaw } from './types'
import Layout from '@/layout/index.vue'

export const constantRoutes: MyRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: {
      title: '登录页',
    },
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          icon: 'dashboard',
          title: '数据舱',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true,
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        meta: {
          title: '用户信息',
          icon: 'user',
        },
      },
    ],
  },
]

export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole.vue'),
        name: 'AuthRole',
        meta: {
          title: '分配角色',
          activeMenu: '/system/user',
          icon: 'biaozhunguanli',
        },
      },
    ],
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: {
          title: '分配用户',
          activeMenu: '/system/role',
          icon: 'biaozhunguanli',
        },
      },
    ],
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)/:dictType',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: {
          title: '字典数据',
          activeMenu: '/system/dict',
          icon: 'biaozhunguanli',
        },
      },
    ],
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log.vue'),
        name: 'JobLog',
        meta: {
          title: '调度日志',
          activeMenu: '/monitor/job',
          icon: 'biaozhunguanli',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export default router
