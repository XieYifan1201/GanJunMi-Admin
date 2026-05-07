import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 根据 token 获取用户信息
export function getInfo(token) {
  return request({
    url: '/api/user/getById',
    method: 'get',
    params: { token }
  })
}

// 修改密码
export function editPwd(params) {
  return request({
    url: '/api/user/editPwd',
    method: 'get',
    params
  })
}
