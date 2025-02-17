import request from '@/utils/request'

export function getPhaseList(data) {
  return request({
    url: '/api/classes/getInfo',
    method: 'POST',
    data
  })
}

export function addPhase(data) {
  return request({
    url: '/api/classes/add',
    method: 'POST',
    data
  })
}

export function removePhase(params) {
  return request({
    url: '/api/classes/delete',
    method: 'GET',
    params
  })
}

export function editPhase(data) {
  return request({
    url: '/api/classes/update',
    method: 'POST',
    data
  })
}

export function getTrains(params) {
  return request({
    url: '/api/classes/getByTrainsId',
    method: 'GET',
    params
  })
}

export function editTrains(data) {
  return request({
    url: '/api/classes/updateClasses',
    method: 'POST',
    data
  })
}

export function removeTrains(params) {
  return request({
    url: '/api/classes/deleteByTrainsClassId',
    method: 'GET',
    params
  })
}

export function addTrains(data) {
  return request({
    url: '/api/classes/addClasses',
    method: 'POST',
    data
  })
}

export function getStudents(data) {
  return request({
    url: '/api/classes/getStudents',
    method: 'POST',
    data
  })
}

export function getCertificate(data) {
  return request({
    url: '/api/student/getCertificate',
    method: 'POST',
    data
  })
}

export function issueCertificate(data) {
  return request({
    url: '/api/student/issueCertificate',
    method: 'POST',
    data
  })
}

export function setCer(data) {
  return request({
    url: '/api/classes/setCertificate',
    method: 'POST',
    data
  })
}

export function getCer(params) {
  return request({
    url: '/api/classes/getCertificate',
    method: 'GET',
    params
  })
}

export function delStu(params) {
  return request({
    url: '/api/student/delete',
    method: 'GET',
    params
  })
}

export function getclass(data) {
  return request({
    url: '/api/classes/getClassInfos',
    method: 'POST',
    data
  })
}

export function setCerContent(data) {
  return request({
    url: '/api/student/addCertificateContent',
    method: 'POST',
    data
  })
}
