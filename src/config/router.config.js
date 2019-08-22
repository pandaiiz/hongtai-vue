// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dispatcher/send-receive',
    children: [
      // dispatcher 收发
      {
        path: '/dispatcher',
        name: 'dispatcher',
        redirect: '/dispatcher/send-receive',
        component: RouteView,
        meta: { title: '收发', keepAlive: true, icon: 'edit', permission: [ 'profile' ] },
        children: [
          {
            path: '/dispatcher/send-receive',
            name: 'SendReceive',
            component: () => import('@/views/dispatcher/send/SendLayout'),
            meta: { title: '收发管理', permission: [ 'profile' ] },
            redirect: '/dispatcher/send/send-receive',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/dispatcher/send/send-receive',
                name: 'EditList',
                component: () => import('@/views/dispatcher/send/SendReceive'),
                meta: { title: '收发管理', permission: [ 'profile' ] }
              },
              {
                path: '/dispatcher/send/timeline',
                name: 'SendTimeline',
                component: () => import('@/views/dispatcher/send/SendTimeline'),
                meta: { title: '收发时间轴', permission: [ 'profile' ] }
              }
            ]
          },
          {
            path: '/dispatcher/report',
            name: 'ReportDay',
            component: () => import('@/views/dispatcher/report/ReportDay'),
            meta: { title: '部门统计', permission: [ 'profile' ] }
          }, {
            path: '/dispatcher/warehouse',
            name: 'Warehouse',
            component: () => import('@/views/dispatcher/warehouse/WareHouseLayout'),
            meta: { title: '仓库统计', permission: [ 'profile' ] },
            redirect: '/dispatcher/warehouse/statistic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/dispatcher/warehouse/statistic',
                name: 'ReportWarehouse',
                component: () => import('@/views/dispatcher/warehouse/WareHouse'),
                meta: { title: '仓库统计', permission: [ 'profile' ] }
              },
              {
                path: '/dispatcher/warehouse/warehouse-details',
                name: 'WareHouseDetails',
                component: () => import('@/views/dispatcher/warehouse/WareHouseDetails'),
                meta: { title: '仓库详情', permission: [ 'profile' ] }
              }
            ]
          }
        ]
      },
      // in and out 单据
      {
        path: '/bills',
        name: 'Bills',
        component: RouteView,
        redirect: '/bills/order',
        meta: { title: '单据', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/bills/order',
            name: 'BillsOrder',
            component: () => import('@/views/bills/order/OrderLayout'),
            meta: { title: '出入库单', keepAlive: false },
            redirect: '/bills/order/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/bills/order/write',
                name: 'BillsWriteOrder',
                component: () => import('@/views/bills/order/OrderWrite'),
                meta: { title: '出入库单', keepAlive: false }
              },
              {
                path: '/bills/order/list',
                name: 'BillsOrderList',
                component: () => import('@/views/bills/order/OrderList'),
                meta: { title: '单据列表', keepAlive: false }
              }
            ]
          },
          // {
          //   path: '/report/total',
          //   name: 'ReportTotal',
          //   component: () => import('@/views/report/total/ReportTotal'),
          //   meta: { title: '总计', permission: [ 'profile' ] }
          // },
          {
            path: '/report/customer',
            name: 'ReportCustomer',
            component: () => import('@/views/report/company/ReportCompany'),
            meta: { title: '客户出入明细', permission: [ 'profile' ] }
          },
          {
            path: '/report/supplier',
            name: 'ReportSupplier',
            component: () => import('@/views/report/supplier/ReportSupplier'),
            meta: { title: '供应商出入明细', permission: [ 'profile' ] }
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
            path: '/setting/customer-input',
            name: 'CustomerInput',
            component: () => import('@/views/setting/CustomerInput'),
            meta: { title: '客户录入', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/setting/customer-list',
            name: 'CustomerList',
            component: () => import('@/views/setting/CustomerList'),
            meta: { title: '客户列表', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/setting/price-list',
            name: 'PriceList',
            component: () => import('@/views/setting/PriceList'),
            meta: { title: '价格明细', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/setting/staff',
            name: 'Staff',
            component: () => import('@/views/setting/Staff'),
            meta: { title: '员工录入', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/setting/staff/list',
            name: 'StaffList',
            component: () => import('@/views/setting/StaffList'),
            meta: { title: '员工列表', permission: [ 'profile' ], keepAlive: false }
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
