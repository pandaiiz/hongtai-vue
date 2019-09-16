import { axios } from '@/utils/request'

const api = {
  staff: '/api/staff'
}

export function getStaff (parameter) {
  return axios({
    url: api.staff,
    method: 'get',
    params: parameter
  })
}
