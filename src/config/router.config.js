// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/processing/send-receive',
    children: [
      // processing 收发
      {
        path: '/processing',
        name: 'Processing',
        redirect: '/processing/send-receive',
        component: RouteView,
        meta: { title: '收发', keepAlive: true, icon: 'edit', permission: [ 'profile' ] },
        children: [
          {
            path: '/processing/send-receive',
            name: 'SendReceive',
            component: () => import('@/views/processing/send/main/SendLayout'),
            meta: { title: '收发管理', permission: [ 'profile' ] },
            redirect: '/processing/send/send-receive',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/processing/send/send-receive',
                name: 'EditList',
                component: () => import('@/views/processing/send/main/SendReceive'),
                meta: { title: '收发管理', permission: [ 'profile' ] }
              }
            ]
          },
          {
            path: '/processing/report',
            name: 'ReportDay',
            component: () => import('@/views/processing/report/ReportDay'),
            meta: { title: '部门统计', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/processing/transfer',
            name: 'Transfer',
            component: () => import('@/views/processing/Transfer'),
            meta: { title: '传递单', permission: [ 'profile' ], keepAlive: false }
          }
        ]
      },
      // in and out 单据
      {
        path: '/inventory',
        name: 'Inventory',
        component: RouteView,
        redirect: '/inventory/main',
        meta: { title: '盘点', icon: 'book', permission: [ 'profile' ] },
        children: [
          {
            path: '/inventory/main',
            name: 'InventoryMain',
            component: () => import('@/views/inventory/main/Main'),
            meta: { title: '传递单', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/inventory/details',
            name: 'InventoryDetails',
            component: () => import('@/views/inventory/details/InventoryDetails'),
            meta: { title: '盘点', permission: [ 'profile' ], keepAlive: false }
          }
          // {
          //   path: '/bills/order',
          //   name: 'BillsOrder',
          //   component: () => import('@/views/bills/order/OrderLayout'),
          //   meta: { title: '出入库单', keepAlive: false },
          //   redirect: '/bills/order/list',
          //   hideChildrenInMenu: true,
          //   children: [
          //     {
          //       path: '/bills/order/write',
          //       name: 'BillsWriteOrder',
          //       component: () => import('@/views/bills/order/OrderWrite'),
          //       meta: { title: '出入库单', keepAlive: false }
          //     },
          //     {
          //       path: '/bills/order/list',
          //       name: 'BillsOrderList',
          //       component: () => import('@/views/bills/order/OrderList'),
          //       meta: { title: '单据列表', keepAlive: false }
          //     }
          //   ]
          // },
          // {
          //   path: '/report/supplier',
          //   name: 'ReportSupplier',
          //   component: () => import('@/views/report/supplier/ReportSupplier'),
          //   meta: { title: '供应商出入明细', permission: [ 'profile' ] }
          // }
        ]
      },
      // 盘点 Inventory
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
                component: () => import('@/views/bills/order/OrderWrite/OrderWriteMaterial'),
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
      // 仓库管理
      {
        path: '/warehouse',
        name: 'Warehouse',
        component: RouteView,
        redirect: '/warehouse/material',
        meta: { title: '仓库', icon: 'shop', permission: [ 'profile' ] },
        children: [
          {
            path: '/warehouse/material',
            name: 'WarehouseMaterial',
            component: () => import('@/views/warehouse/material/Main'),
            meta: { title: '物料仓', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/warehouse/send',
            name: 'WarehouseSend',
            component: () => import('@/views//warehouse/send/Main'),
            meta: { title: '收发仓', permission: [ 'profile' ] }
          },
          {
            path: '/warehouse/finished',
            name: 'WarehouseFinished',
            component: () => import('@/views/warehouse/finished/Main'),
            meta: { title: '成品仓', permission: [ 'profile' ] }
          }
        ]
      },
      {
        path: '/company',
        name: 'Company',
        component: RouteView,
        redirect: '/company/basic',
        meta: { title: '客户/供应商', icon: 'bank', permission: [ 'profile' ] },
        children: [
          {
            path: '/company/company-input',
            name: 'CompanyInput',
            component: () => import('@/views/company/CompanyInput'),
            meta: { title: '客户录入', permission: [ 'profile' ], keepAlive: false }
          },
          {
            path: '/company/company-list',
            name: 'CompanyList',
            component: () => import('@/views/company/CompanyList'),
            meta: { title: '客户列表', permission: [ 'profile' ], keepAlive: false }
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
            component: () => import('@/views/setting/basic/BasicLayout'),
            meta: { title: '基础配置', permission: [ 'profile' ], keepAlive: false },
            redirect: '/setting/basic/basic-list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/setting/basic/basic-list',
                name: 'BasicList',
                component: () => import('@/views/setting/basic/BasicList'),
                meta: { title: '基础配置', permission: [ 'profile' ], keepAlive: false }
              },
              {
                path: '/setting/basic/basic-edit',
                name: 'BasicEdit',
                component: () => import('@/views/setting/basic/BasicEdit'),
                meta: { title: '配置修改', permission: [ 'profile' ], keepAlive: false }
              }
            ]
          },
          {
            path: '/setting/staff',
            name: 'Staff',
            component: () => import('@/views/setting/staff/StaffLayout'),
            meta: { title: '员工列表', permission: [ 'profile' ], keepAlive: false },
            redirect: '/setting/staff/staff-list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/setting/staff/staff-list',
                name: 'StaffList',
                component: () => import('@/views/setting/staff/StaffList'),
                meta: { title: '员工配置', permission: [ 'profile' ], keepAlive: false }
              },
              {
                path: '/setting/staff/staff-edit',
                name: 'StaffEdit',
                component: () => import('@/views/setting/staff/StaffEdit'),
                meta: { title: '员工修改', permission: [ 'profile' ], keepAlive: false }
              }
            ]
          },
          {
            path: '/setting/price-list',
            name: 'PriceList',
            component: () => import('@/views/setting/PriceList'),
            meta: { title: '价格明细', permission: [ 'profile' ], keepAlive: false }
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
