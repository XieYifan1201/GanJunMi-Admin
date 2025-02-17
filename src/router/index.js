import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
        name: 'Certificate',
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
        name: 'Add',
        component: () => import('@/views/admin/add.vue'),
        meta: { title: '添加管理员', icon: 'el-icon-setting' }
      },
      {
        path: 'index',
        name: 'Index',
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

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
