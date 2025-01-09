import nProgress from 'nprogress'
import { Message } from '@arco-design/web-vue'
import router from '@/router'
import 'nprogress/nprogress.css'
import { isRelogin } from '@/utils/request'
import { isHttp } from '@/utils/validate'

nProgress.configure({
  showSpinner: false,
})

router.beforeEach(async (to, _, next) => {
  nProgress.start()
  useHead({
    title: to.meta?.title ? `Arco Ruoyi Manage - ${to.meta?.title}` : `Arco Ruoyi Manage`,
  })
  const { getToken } = useAuth()
  const whiteList = ['/login']
  const { roles, getUserInfo, logout } = useUserStore()
  const { generateRoutes } = usePermissionStore()
  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    }
    else if (roles.length === 0) {
      isRelogin.show = true
      try {
        await getUserInfo()
        isRelogin.show = false
        const accessRoutes = await generateRoutes()
        accessRoutes.forEach((route: any) => {
          if (!isHttp(route.path)) {
            router.addRoute(route) // 动态添加可访问路由表
          }
        })
        next({ ...to, replace: true })
      }
      catch (e: any) {
        await logout()
        Message.error(e)
        next('/')
      }
    }
    else {
      next()
    }
  }
  else if (whiteList.includes(to.path)) {
    next()
  }
  else {
    next(`/login?redirect=${to.fullPath}`)
  }
})

router.afterEach(() => {
  nProgress.done()
})
