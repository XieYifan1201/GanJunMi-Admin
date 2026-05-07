import request from '@/utils/request'

// 分页查询学员列表（含培训信息）
export function getStuList(data) {
  return request({
    url: '/api/student/getByBatch2',
    method: 'POST',
    data
  })
}

// 分页查询学员列表（基础信息）
export function getStuList2(data) {
  return request({
    url: '/api/student/getByBatch1',
    method: 'POST',
    data
  })
}

// 新增或修改学员发票信息
export function editInvoice(data) {
  return request({
    url: '/api/invoice/addOrUpdateInvoice?idCard=' + data.idCard,
    method: 'POST',
    data
  })
}

// 根据身份证号查询发票信息
export function getInvoice(params) {
  return request({
    url: '/api/invoice/getInvoiceByIdCard',
    method: 'GET',
    params
  })
}

// 删除学员
export function delStuList(params) {
  return request({
    url: '/api/student/delete',
    method: 'GET',
    params
  })
}

// 修改学员信息
export function editStuList(data) {
  return request({
    url: '/api/student/update',
    method: 'POST',
    data
  })
}

// 新增学员
export function addStuList(data) {
  return request({
    url: '/api/student/add',
    method: 'POST',
    data
  })
}

// 管理员代学员报名（更新签到状态）
export function regStu(data) {
  return request({
    url: '/api/student/SAUpdateSign',
    method: 'POST',
    data
  })
}

// 学员自主报名
export function regStu2(data) {
  return request({
    url: '/api/student/sign',
    method: 'POST',
    data
  })
}

// 批量设置学员缴费状态
export function setPay(data) {
  return request({
    url: '/api/student/updatePayStatus',
    method: 'POST',
    data
  })
}
