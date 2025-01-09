/**
 * 通过给定的URL下载文件。
 * @param {string} url - 要下载文件的URL。
 */
export function downLoadByUrl(url: string) {
  const link: HTMLAnchorElement = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 获取起始日期和结束日期之间的所有年月
 * @param start 起始日期，格式为'年-月'
 * @param end 结束日期，格式为'年-月'
 * @returns 所有年月的数组
 */
export function getYearAndMonth(start: any, end: any) {
  const result: any[] = []
  const newResult: any[] = []
  const starts = start.split('-')
  const ends = end.split('-')
  let staYear: number = Number.parseInt(starts[0])
  let staMon: number = Number.parseInt(starts[1])
  const endYear: number = Number.parseInt(ends[0])
  const endMon: number = Number.parseInt(ends[1])

  // 循环年份，将年份范围内的每个月加入result数组
  while (staYear <= endYear) {
    if (staYear === endYear) {
      // 如果起始年份和结束年份相同，则只循环到结束月份
      while (staMon < endMon) {
        staMon++
        result.push({ year: staYear, month: staMon })
      }
      staYear++
    }
    else {
      // 如果起始年份和结束年份不同，则循环到下一年的1月份
      staMon++
      if (staMon > 12) {
        staMon = 1
        staYear++
      }
      result.push({ year: staYear, month: staMon })
    }
  }

  // 将result数组中的年月格式转换为字符串，并添加到newResult数组中
  for (let i: number = 0; i < result.length; i++) {
    const year = result[i].year
    let month: any = result[i].month
    // 补'0'操作
    if (month < 10) {
      month = `0${month}`
    }
    else {
      month = `${month}`
    }
    const ym: string = `${year}-${month}`
    newResult.push(ym)
  }

  // 将起始日期添加到newResult数组的开头
  newResult.unshift(start)

  return newResult
}

/**
 * 获取两个日期之间的年份
 * @param start 开始日期
 * @param end 结束日期
 * @returns 年份数组
 */
export function getYearBetween(start: any, end: any) {
  const result: any[] = []
  let min: number = new Date(start).getFullYear()
  const max: number = new Date(end).getFullYear()
  while (min <= max) {
    result.push(min)
    min = Number(min) + 1
  }
  return result
}

/**
 * 获取正常的路径
 * @param {any} p - 输入的路径
 * @returns {any} - 处理后的路径
 */
export function getNormalPath(p: any) {
  if (p.length === 0 || !p || p === 'undefined' || p === undefined) {
    return p
  }
  const res = p.replace(/\/\//g, '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(
  data: any,
  id?: any,
  parentId?: any,
  children?: any,
) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  }

  const childrenListMap: any = {}
  const nodeIds: any = {}
  const tree = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

/**
 * 转换字符串，undefined,null等转化为""
 */
export function parseStrEmpty(str: any) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

/**
 * 添加日期范围到搜索参数
 * @param params - 搜索参数对象
 * @param dateRange - 日期范围数组
 * @param propName - 要添加的属性名称
 * @returns 修改后的搜索参数对象
 */
export function addDateRange(params?: any, dateRange?: any, propName?: any) {
  const search = params
  search.params
    = typeof search.params === 'object'
    && search.params !== null
    && !Array.isArray(search.params)
      ? search.params
      : {}
  dateRange = Array.isArray(dateRange) ? dateRange : []
  if (typeof propName === 'undefined') {
    search.params.beginTime = dateRange[0]
    search.params.endTime = dateRange[1]
  }
  else {
    search.params[`begin${propName}`] = dateRange[0]
    search.params[`end${propName}`] = dateRange[1]
  }
  return search
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = `${encodeURIComponent(propName)}=`
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null
            && value[key] !== ''
            && typeof value[key] !== 'undefined'
          ) {
            const params = `${propName}[${key}]`
            const subPart = `${encodeURIComponent(params)}=`
            result += `${subPart + encodeURIComponent(value[key])}&`
          }
        }
      }
      else {
        result += `${part + encodeURIComponent(value)}&`
      }
    }
  }
  return result
}

/**
 * 验证是否为blob格式
 *
 * @param {any} data - 需要验证的数据
 * @returns {boolean} - 如果数据类型不是'tapplication/json'，返回true；否则返回false
 */
export function blobValidate(data: any) {
  return data.type !== 'application/json'
}

/**
 * 解析时间
 * @param {any} time - 时间参数
 * @param {any} pattern - 时间格式化字符串（可选）
 * @returns {string} - 解析后的时间字符串
 */
export function parseTime(time: any, pattern?: any) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  }
  else {
    if (typeof time === 'string' && /^\d+$/.test(time)) {
      time = Number.parseInt(time)
    }
    else if (typeof time === 'string') {
      time = time
        .replace(/-/g, '/')
        .replace('T', ' ')
        .replace(/\.\d{3}/g, '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(
    /\{([ymdhisa])+\}/g,
    (result: any, key: any) => {
      let value = formatObj[key as keyof typeof formatObj]
      // 注意：getDay()在星期天返回0
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = `0${value}`
      }
      return value || 0
    },
  )
  return time_str
}

/**
 * 回显数据字典
 * @param datas - 数据对象
 * @param value - 值
 * @returns 字典标签
 */
export function selectDictLabel(datas: any, value: any) {
  if (value === undefined) {
    return ''
  }
  const actions = []
  Object.keys(datas).some((key) => {
    if (datas[key].value === `${value}`) {
      actions.push(datas[key].label)
      return true
    }
  })
  if (actions.length === 0) {
    actions.push(value)
  }
  return actions.join('')
}

/**
 * 文件链接转文件流下载--主要针对pdf 解决谷歌浏览器a标签下载pdf直接打开的问题
 * @param {string} url - 文件的URL地址
 * @param {string} fileName - 保存的文件名
 * @param {any} type - 文件类型
 * @param {any} fn - 文件下载进度回调函数
 */
export function saveFileToLink(
  url: string,
  fileName: string,
  type?: any,
  fn?: any,
) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', url, true)
  xhr.setRequestHeader('Content-Type', `application/${type}`)
  xhr.setRequestHeader('If-Modified-Since', '0') // 解决缓存问题,每次请求都去请求服务器获取最新数据
  xhr.responseType = 'blob'
  ;(xhr.onprogress = function (e) {
    // 文件下载进度
    if (fn && typeof fn === 'function') {
      fn(e) // 监听文件下载进度;
    }
  }),
  (xhr.onload = function () {
    if (this.status === 200) {
      // 接受二进制文件流
      const blob = this.response
      saveFileToBlob(blob, fileName, type)
    }
  }),
  xhr.send()
}

/**
 * 将文件保存为Blob对象
 * @param {any} blob - 要保存的Blob对象
 * @param {any} tagFileName - 下载文件的标签文件名
 * @param {any} fileType - 下载文件的文件类型
 */
export function saveFileToBlob(blob?: any, tagFileName?: any, fileType?: any) {
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = `${tagFileName}.${fileType}` // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉Blob对象
}

/**
 * 将分转换为元
 * @param fen - 分数值
 * @returns - 元数值
 */
export function regFenToYuan(fen: any) {
  let num: any = fen
  num = fen * 0.01
  num += ''
  const reg: RegExp
    = num.includes('.')
      ? /(\d{1,3})(?=(?:\d{3})+\.)/g
      : /(\d{1,3})(?=(?:\d{3})+$)/g
  num = num.replace(reg, '$1')
  num = toDecimal2(num)
  return num
}

/**
 * 强制保留2位小数，如：2，会在2后面补上00.即2.00
 * @param x - 输入值
 * @returns 两位小数的十进制表示，如果转换失败则返回false
 */
export function toDecimal2(x: any): boolean | string {
  let f: number = Number.parseFloat(x)
  if (isNaN(f)) {
    return false
  }
  f = Math.round(x * 100) / 100
  let s: string = f.toString()
  let rs: number = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}
