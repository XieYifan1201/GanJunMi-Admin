import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url .env文件内
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 请求超时时间ms
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // 如果存在token
    if (store.getters.token) {
      // 把token设置到请求头中
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 如果自定义code不为1，则为错误
    if (res.code !== 1) {
      Message({
        message: res.msg || '错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
