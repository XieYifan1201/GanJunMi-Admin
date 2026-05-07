/**
 * 判断路径是否为外部链接
 * @param {string} path - 待检测路径
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 用户名校验（当前项目未做限制，始终通过）
 * @param {string} str - 用户名
 * @returns {boolean}
 */
export function validUsername(str) {
  return true
}
