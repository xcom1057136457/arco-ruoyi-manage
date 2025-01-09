import request from '@/utils/request'

// 登录
export function login(data: any) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

// 获取验证码
export function getCaptureCode() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false,
    },
    method: 'get',
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

// 密码更改
export function changePassword(params: any) {
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params,
  })
}

// 获取权限菜单
export function getRoutes() {
  return request({
    url: '/getRouters',
    method: 'get',
  })
}
