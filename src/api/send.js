import { axios } from '@/utils/request'

const api = {
  machining: '/api/machining',
  scanning: '/api/machining/scan'
}

// export default api

export function supplementMachining (parameter) {
  return axios({
    url: '/api/machining/supplement',
    method: 'post',
    data: parameter
  })
}

export function saveMachining (parameter) {
  return axios({
    url: api.machining,
    method: 'post',
    data: parameter
  })
}

export function deleteMachining (parameter) {
  return axios({
    url: api.machining,
    method: 'delete',
    params: parameter
  })
}

export function scanMachining (parameter) {
  return axios({
    url: api.scanning,
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
