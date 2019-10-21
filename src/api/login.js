// import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: 'http://localhost:3000/admin/api/login',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/api/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: '/api/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
