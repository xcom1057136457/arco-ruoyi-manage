import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import axios from 'axios'
import { Message, Modal, Notification } from '@arco-design/web-vue'
import { h } from 'vue'
import { saveAs } from 'file-saver'
import errorCode from '@/utils/errorCode'
import cache from '@/utils/cache'
import { blobValidate, tansParams } from '@/utils/utils'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_WEB_BASE_URL,
  timeout: 120000,
  withCredentials: true,
})

export const isRelogin: { show: boolean } = { show: false }

service.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

service.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const { getToken } = useAuth()

    const isToken: boolean = (config.headers || {})?.isToken === false

    if (getToken() && !isToken) {
      config.headers!.Authorization = `Bearer ${getToken()}`
    }

    if (config.method === 'get' && config.params) {
      let url = `${config.url}?${tansParams(config.params)}`
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    const isRepeatSubmit: boolean
      = (config.headers || {})?.isRepeatSubmit === false

    if (
      !isRepeatSubmit
      && (config.method === 'post' || config.method === 'put')
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (
        sessionObj === undefined
        || sessionObj === null
        || sessionObj === ''
      ) {
        cache.session.setJSON('sessionObj', requestObj)
      }
      else {
        const sUrl = sessionObj.url
        const sData = sessionObj.data
        const sTime = sessionObj.time
        const interval = 1000
        if (
          sData === requestObj.data
          && requestObj.time - sTime < interval
          && sUrl === requestObj.url
        ) {
          const message: string = '数据正在处理，请勿重复提交'
          return Promise.reject(new Error(message))
        }
        cache.session.setJSON('sessionObj', requestObj)
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { logout } = useUserStore()

    const code = response.data?.code || 200

    const message
      = errorCode[code as keyof typeof errorCode]
      || response.data?.msg
      || errorCode.default

    if (code === 401 || code === 402) {
      if (!isRelogin.show) {
        isRelogin.show = true
        let contentText: any = null
        if (code === 401) {
          contentText = '登录状态已过期，您可以继续留在该页面，或者重新登录'
        }
        else if (code === 402) {
          contentText = () =>
            h('div', { class: 'space-y-5' }, [
              h(
                'div',
                null,
                `系统检测到您在其他地方登录，如非本人操作请联系管理员`,
              ),
              h('div', null, `登录账号：${response.data.userName}`),
              h('div', null, `登录时间：${response.data.loginTime}`),
              h('div', null, `操作系统：${response.data.os}`),
              h('div', null, `浏览器版本：${response.data.browser}`),
              h('div', null, `IP地址：${response.data.ipaddr}`),
            ])
        }
        Modal.confirm({
          title: '系统通知',
          content: contentText,
          okText: '重新登录',
          cancelText: '取消',
          async onOk() {
            isRelogin.show = false
            await logout()
            location.href = '/dashboard'
          },
          onCancel() {
            isRelogin.show = false
          },
        })
      }
      return Promise.reject(
        '无效的会话，或者会话已过期，请重新登录。',
      )
    }
    else if (code === 500) {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
    else if (code === 601) {
      Message.warning(message)
      return Promise.reject(new Error(message))
    }
    else if (code !== 200) {
      Notification.error({
        title: '系统提示',
        content: message,
      })
      return Promise.reject(new Error(message))
    }

    return Promise.resolve(response.data)
  },
  (error: AxiosError) => {
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    }
    else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `系统接口${message.substring(message.length - 3)}异常`
    }
    Message.error({
      content: message,
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

/**
 * 下载文件
 * @param url - 文件的URL
 * @param params - 下载所需的参数
 * @param filename - 文件名
 * @param config - 配置项
 * @returns Promise
 */
export async function download(url: any, params?: any, filename?: any, config?: any) {
  return service
    .post(url, params, {
      transformRequest: [
        // 转换参数
        (params) => {
          return tansParams(params)
        },
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config,
    })
    .then(async (data: any) => {
      const isBlob = blobValidate(data)
      if (isBlob) {
        // 创建Blob对象
        const blob = new Blob([data])
        // 下载文件
        saveAs(blob, filename)
      }
      else {
        // 获取响应文本
        const resText = await data.text()
        // 解析响应JSON对象
        const rspObj = JSON.parse(resText)
        // 提取出错误信息
        const errMsg: any
          = errorCode[rspObj.code as keyof typeof errorCode]
          || rspObj.msg
          || errorCode.default
        // 显示错误信息
        Message.error(errMsg)
      }
    })
    .catch(() => {
      // 下载文件出错，显示错误信息
      Message.error('下载文件出现错误，请联系管理员！')
    })
}

export default service
