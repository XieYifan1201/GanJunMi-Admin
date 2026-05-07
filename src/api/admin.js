import request from '@/utils/request'

// 分页查询管理员列表
export function getAdminList(data) {
  return request({
    url: '/api/user/page1',
    method: 'POST',
    data
  })
}

// 新增管理员
export function addAdmin(data) {
  return request({
    url: '/api/user/addAdmin',
    method: 'POST',
    data
  })
}

// 删除管理员
export function delAdmin(data) {
  return request({
    url: '/api/user/delete?id=' + data.id,
    method: 'GET',
    data
  })
}

// 重置管理员密码
export function resPwd(data) {
  return request({
    url: '/api/user/resetPwd?id=' + data.id,
    method: 'GET',
    data
  })
}
