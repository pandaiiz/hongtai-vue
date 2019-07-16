// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/send/send-receive',
    children: [
      // send
      {
        path: '/send',
        name: 'send',
        redirect: '/send/edit-table',
        component: RouteView,
        meta: { title: '信息录入', keepAlive: true, icon: 'edit', permission: [ 'profile' ] },
        children: [
          {
            path: '/send/send-receive',
            name: 'EditList',
            component: () => import('@/views/send/TableInnerEditList'),
            meta: { title: '收发管理', keepAlive: false }
          },
          {
            path: '/send/orderlist',
            name: 'InAndOutOrder',
            component: () => import('@/views/send/order/OrderList'),
            meta: { title: '出入库单', keepAlive: false }
          }
        ]
      },
      // report
      {
        path: '/report',
        name: 'report',
        component: RouteView,
        redirect: '/report/basic',
        meta: { title: '报表', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/report/total',
            name: 'ReportTotal',
            component: () => import('@/views/report/total/ReportTotal'),
            meta: { title: '总计', permission: [ 'profile' ] }
          },
          {
            path: '/report/day',
            name: 'ReportDay',
            component: () => import('@/views/report/day/ReportDay'),
            meta: { title: '每日', permission: [ 'profile' ] }
          }
        ]
      },
      // system setting
      {
        path: '/setting',
        name: 'setting',
        component: RouteView,
        redirect: '/setting/basic',
        meta: { title: '系统设置', icon: 'setting', permission: [ 'profile' ] },
        children: [
          {
            path: '/setting/basic',
            name: 'Basic',
            component: () => import('@/views/setting/Basic'),
            meta: { title: '基础配置', permission: [ 'profile' ] }
          },
          {
            path: '/setting/customer',
            name: 'CustomerInput',
            component: () => import('@/views/setting/CustomerInput'),
            meta: { title: '客户录入', permission: [ 'profile' ] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
