import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

// 禁用进度环，只保留顶部进度条
NProgress.configure({ showSpinner: false })

// 免登录白名单
const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录时访问登录页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 拉取用户信息后放行
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // 用户信息获取失败，清除凭证并跳转登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单页面直接放行
      next()
    } else {
      // 未登录且非白名单页面，跳转登录页并记录来源路径
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
