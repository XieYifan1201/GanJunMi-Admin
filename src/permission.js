import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单

// 路由守卫
router.beforeEach(async(to, from, next) => {
  // 启用加载图标
  NProgress.start()

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录，直接跳转到home页
      next({ path: '/' })
      NProgress.done() // 关闭加载图标
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // 获取用户信息失败，跳转到login页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done() // 关闭加载图标
        }
      }
    }
  } else {
    /* 无token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 判断是不是白名单，白名单放行
      next()
    } else {
      // 其它页面跳转道登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭加载图标
  NProgress.done()
})
