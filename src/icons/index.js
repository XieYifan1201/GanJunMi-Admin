import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// 全局注册 SVG 图标组件
Vue.component('svg-icon', SvgIcon)

// 批量导入 ./svg 目录下的所有 SVG 文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
