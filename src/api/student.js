import request from '@/utils/request'

export function getStuList(data) {
  return request({
    url: '/api/student/getByBatch2',
    method: 'POST',
    data
  })
}
export function getStuList2(data) {
  return request({
    url: '/api/student/getByBatch1',
    method: 'POST',
    data
  })
}

export function editInvoice(data) {
  return request({
    url: '/api/invoice/addOrUpdateInvoice?idCard=' + data.idCard,
    method: 'POST',
    data
  })
}

export function getInvoice(params) {
  return request({
    url: '/api/invoice/getInvoiceByIdCard',
    method: 'GET',
    params
  })
}

export function delStuList(params) {
  return request({
    url: '/api/student/delete',
    method: 'GET',
    params
  })
}

export function editStuList(data) {
  return request({
    url: '/api/student/update',
    method: 'POST',
    data
  })
}

export function addStuList(data) {
  return request({
    url: '/api/student/add',
    method: 'POST',
    data
  })
}

export function regStu(data) {
  return request({
    url: '/api/student/SAUpdateSign',
    method: 'POST',
    data
  })
}

export function regStu2(data) {
  return request({
    url: '/api/student/sign',
    method: 'POST',
    data
  })
}

export function setPay(data) {
  return request({
    url: '/api/student/updatePayStatus',
    method: 'POST',
    data
  })
}
