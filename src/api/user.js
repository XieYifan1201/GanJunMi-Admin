import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/getById',
    method: 'get',
    params: { token }
  })
}

export function editPwd(params) {
  return request({
    url: '/api/user/editPwd',
    method: 'get',
    params
  })
}
