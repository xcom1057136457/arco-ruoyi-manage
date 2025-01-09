/**
 * 判断url是否是http或https
 */
export function isHttp(url: string): boolean {
  return url.includes('http://') || url.includes('https://')
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断给定字符串是否为有效的用户名
 * @param str 待判断的字符串
 * @returns 若字符串是有效的用户名则返回true，否则返回false
 */
export function validUsername(str: string): boolean {
  const valid_map = ['admin', 'editor']
  return valid_map.includes(str.trim())
}

/**
 * 判断给定的字符串是否为有效的URL链接
 * @param {string} url - 待判断的URL链接
 * @returns {boolean} - 返回一个布尔值，表示给定的URL链接是否有效
 */
export function validURL(url: string): boolean {
  const reg
    = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:\d+)*(\/($|[\w.,?'\\+&%$#=~-]+))*$/
  return reg.test(url)
}

/**
 * 判断一个字符串是否只包含小写字母
 * @param str 要判断的字符串
 * @returns 如果字符串只包含小写字母，则返回true；否则返回false
 */
export function validLowerCase(str: string): boolean {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 判断给定的字符串是否全为大写字母
 * @param str 待判断的字符串
 * @returns 若全为大写字母则返回true，否则返回false
 */
export function validUpperCase(str: string): boolean {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {boolean}
 */
export function validAlphabets(str: string): boolean {
  const reg = /^[A-Z]+$/i
  return reg.test(str)
}

/**
 * 判断一个对象是否为数组
 * @param arg 要判断的对象
 * @returns 如果对象是数组则返回true，否则返回false
 */
export function isArray(arg: unknown[]): boolean {
  // 如果没有定义Array.isArray，则通过Object.prototype.toString.call方法判断
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  // 使用Array.isArray方法判断
  return Array.isArray(arg)
}
