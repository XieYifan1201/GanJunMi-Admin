import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

// 根据路由 meta.title 拼接完整的浏览器标题
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
