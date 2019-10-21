import { axios } from '@/utils/request'
import api from '@/api/index'

export function getSetting (parameter) {
  return axios({
    url: `${api.Settings}/${parameter}`,
    method: 'get'
  })
}

export function putSetting (id, parameter) {
  return axios({
    url: `${api.Settings}/${id}`,
    method: 'put',
    params: parameter
  })
}
