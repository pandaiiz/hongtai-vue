import { axios } from '@/utils/request'
import api from '@/api/index'

export function getSettingList () {
  return axios({
    url: api.Settings,
    method: 'get'
  })
}

export function saveTransferRecords (parameter) {
  return axios({
    url: api.TransferRecord,
    method: 'post',
    data: parameter
  })
}

export function deleteSetting (parameter) {
  return axios({
    url: `${api.Settings}/${parameter}`,
    method: 'delete'
  })
}

export function putSetting (id, parameter) {
  return axios({
    url: `${api.Settings}/${id}`,
    method: 'put',
    data: parameter
  })
}

export function getSetting (parameter) {
  return axios({
    url: `${api.Settings}/${parameter}`,
    method: 'get'
  })
}
