import request from '@/utils/request'

// 分页查询培训列表
export function getPhaseList(data) {
  return request({
    url: '/api/classes/getInfo',
    method: 'POST',
    data
  })
}

// 新增培训
export function addPhase(data) {
  return request({
    url: '/api/classes/add',
    method: 'POST',
    data
  })
}

// 删除培训
export function removePhase(params) {
  return request({
    url: '/api/classes/delete',
    method: 'GET',
    params
  })
}

// 修改培训信息
export function editPhase(data) {
  return request({
    url: '/api/classes/update',
    method: 'POST',
    data
  })
}

// 根据培训ID查询班次列表
export function getTrains(params) {
  return request({
    url: '/api/classes/getByTrainsId',
    method: 'GET',
    params
  })
}

// 修改班次信息
export function editTrains(data) {
  return request({
    url: '/api/classes/updateClasses',
    method: 'POST',
    data
  })
}

// 删除班次
export function removeTrains(params) {
  return request({
    url: '/api/classes/deleteByTrainsClassId',
    method: 'GET',
    params
  })
}

// 新增班次
export function addTrains(data) {
  return request({
    url: '/api/classes/addClasses',
    method: 'POST',
    data
  })
}

// 分页查询班次下的学员列表
export function getStudents(data) {
  return request({
    url: '/api/classes/getStudents',
    method: 'POST',
    data
  })
}

// 查询学员证书信息
export function getCertificate(data) {
  return request({
    url: '/api/student/getCertificate',
    method: 'POST',
    data
  })
}

// 批量颁发证书
export function issueCertificate(data) {
  return request({
    url: '/api/student/issueCertificate',
    method: 'POST',
    data
  })
}

// 设置培训证书模板信息
export function setCer(data) {
  return request({
    url: '/api/classes/setCertificate',
    method: 'POST',
    data
  })
}

// 获取培训证书模板信息
export function getCer(params) {
  return request({
    url: '/api/classes/getCertificate',
    method: 'GET',
    params
  })
}

// 删除学员
export function delStu(params) {
  return request({
    url: '/api/student/delete',
    method: 'GET',
    params
  })
}

// 查询班次统计信息（含报名人数）
export function getclass(data) {
  return request({
    url: '/api/classes/getClassInfos',
    method: 'POST',
    data
  })
}

// 修改学员证书内容
export function setCerContent(data) {
  return request({
    url: '/api/student/addCertificateContent',
    method: 'POST',
    data
  })
}
