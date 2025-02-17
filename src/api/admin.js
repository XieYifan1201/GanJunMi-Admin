import request from '@/utils/request'

export function getAdminList(data) {
  return request({
    url: '/api/user/page1',
    method: 'POST',
    data
  })
}

export function addAdmin(data) {
  return request({
    url: '/api/user/addAdmin',
    method: 'POST',
    data
  })
}

export function delAdmin(data) {
  return request({
    url: '/api/user/delete?id=' + data.id,
    method: 'GET',
    data
  })
}

export function resPwd(data) {
  return request({
    url: '/api/user/resetPwd?id=' + data.id,
    method: 'GET',
    data
  })
}
