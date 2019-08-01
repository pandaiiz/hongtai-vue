import { axios } from '@/utils/request'

const api = {
  data: '/api/machining',
  order: '/api/order',
  company: '/api/company',
  statistics: '/api/statistics',
  list: '/api/list',
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager',
  orgTree: '/api/org/tree'
}

export default api

export function getCompanyList (parameter) {
  return axios({
    url: api.company,
    method: 'get',
    params: parameter
  })
}

export function getOrderList (parameter) {
  return axios({
    url: api.order,
    method: 'get',
    params: parameter
  })
}

export function getDataList (parameter) {
  return axios({
    url: api.data,
    method: 'get',
    params: parameter
  })
}

export function postData (parameter) {
  console.log(parameter)
  return axios({
    url: api.data,
    method: 'post',
    params: parameter
  })
}

export function getStatistics (parameter) {
  return axios({
    url: api.statistics,
    method: 'get',
    params: parameter
  })
}

export function getInfoList () {
  return axios({
    url: api.list,
    method: 'get'
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
