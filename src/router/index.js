import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * 路由配置说明：
 * hidden: true             是否在侧边栏隐藏（默认 false）
 * alwaysShow: true         是否始终显示根菜单
 * redirect: noRedirect     面包屑中不产生重定向
 * name:'router-name'       用于 <keep-alive> 缓存，必须唯一
 * meta: {
 *   title: '标题'          侧边栏和面包屑中显示的名称
 *   icon: 'svg-name'       侧边栏图标
 *   activeMenu: '/path'    高亮指定侧边栏菜单项
 * }
 */

// 静态路由，所有角色均可访问
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/trains',
    component: Layout,
    redirect: '/trains',
    name: 'trains',
    meta: { title: '培训管理', icon: 'el-icon-s-claim' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/trains/list'),
        meta: { title: '培训信息管理', icon: 'tree' }
      },
      {
        path: 'trainsList',
        name: 'TrainsList',
        component: () => import('@/views/trains/trainsList'),
        meta: { title: '培训期数管理', icon: 'el-icon-school' }
      },
      {
        path: 'upload',
        name: 'UpLoad',
        component: () => import('@/views/trains/upload'),
        meta: { title: '回执空表上传', icon: 'el-icon-folder' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student',
    name: 'student',
    meta: { title: '学员管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/student/add'),
        meta: { title: '学员信息添加', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/student/index'),
        meta: { title: '学员信息管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'invoice',
        name: 'Invoice',
        component: () => import('@/views/student/invoice'),
        meta: { title: '学员缴费管理', icon: 'el-icon-bank-card' }
      }
    ]
  },
  {
    path: '/certificate',
    component: Layout,
    redirect: '/certificate',
    name: 'Certificate',
    meta: { title: '证书管理', icon: 'el-icon-reading' },
    children: [
      {
        path: 'set',
        name: 'Set',
        component: () => import('@/views/certificate/set'),
        meta: { title: '培训证书管理', icon: 'el-icon-setting' }
      },
      {
        path: 'certificate',
        name: 'CertificatePage',
        component: () => import('@/views/certificate/index'),
        meta: { title: '学员证书管理', icon: 'el-icon-files' }
      },
      {
        path: 'print',
        name: 'Print',
        component: () => import('@/views/certificate/print'),
        meta: { title: '学员证书打印', icon: 'el-icon-printer' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin',
    name: 'Admin',
    meta: { title: '用户管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'add',
        name: 'AdminAdd',
        component: () => import('@/views/admin/add.vue'),
        meta: { title: '添加管理员', icon: 'el-icon-setting' }
      },
      {
        path: 'index',
        name: 'AdminIndex',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员列表', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/editPassword',
    component: () => import('@/views/login/editPassword'),
    hidden: true
  },
  // 404 兜底路由，必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由，用于动态路由场景
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
