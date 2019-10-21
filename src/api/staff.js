import { axios } from '@/utils/request'
import api from '@/api/index'

export function getStaffList () {
  return axios({
    url: api.Staff,
    method: 'get'
  })
}

export function getStaff (id) {
  return axios({
    url: `${api.Staff}/${id}`,
    method: 'get'
  })
}

export function putStaff (parameter) {
  return axios({
    url: api.Staff,
    method: 'put',
    params: parameter
  })
}
