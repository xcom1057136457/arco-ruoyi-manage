import { getRoutes } from '@/api/login'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import InnerLink from '@/components/InnerLink/index.vue'
import auth from '@/plugins/auth'

const modules = import.meta.glob('../views/**/*.vue')

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])

  const addRoutes = ref([])

  const defaultRoutes = ref([])

  const topbarRouters = ref([])

  const sidebarRouters = ref([])

  const setRoutes = (routesData: any) => {
    addRoutes.value = routesData
    routes.value = constantRoutes.concat(routesData) as any
  }

  const setDefaultRoutes = (routesData: any) => {
    defaultRoutes.value = constantRoutes.concat(routesData) as any
  }

  const setTopbarRoutes = (routesData: any) => {
    topbarRouters.value = routesData
  }

  const setSidebarRouters = (routesData: any) => {
    sidebarRouters.value = routesData
  }

  const generateRoutes = async () => {
    try {
      const { code, data }: any = await getRoutes()
      if (code === 200) {
        const sdata = JSON.parse(JSON.stringify(data)) // 复制数据
        const rdata = JSON.parse(JSON.stringify(data)) // 复制数据
        const defaultData = JSON.parse(JSON.stringify(data)) // 复制数据
        const sidebarRoutes = filterAsyncRouter(sdata) // 过滤侧边栏路由
        const rewriteRoutes = filterAsyncRouter(rdata, false, true) // 过滤重写路由
        const defaultRoutes = filterAsyncRouter(defaultData) // 过滤默认路由
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes) // 过滤动态路由
        asyncRoutes.forEach((route: any) => {
          router.addRoute(route) // 添加动态路由
        })
        setRoutes(rewriteRoutes) // 设置重写路由
        setSidebarRouters(constantRoutes.concat(sidebarRoutes)) // 设置侧边栏路由
        setDefaultRoutes(sidebarRoutes) // 设置默认路由
        setTopbarRoutes(defaultRoutes) // 设置顶部导航路由
        return Promise.resolve(rewriteRoutes)
      }
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    routes,
    addRoutes,
    defaultRoutes,
    topbarRouters,
    sidebarRouters,
    setRoutes,
    setDefaultRoutes,
    setTopbarRoutes,
    setSidebarRouters,
    generateRoutes,
  }
})

function filterAsyncRouter(
  asyncRouterMap: any,
  _?: any,
  type = false,
) {
  return asyncRouterMap.filter((route: any) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // 对 Layout ParentView 组件进行特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      }
      else if (route.component === 'ParentView') {
        route.component = ParentView
      }
      else if (route.component === 'InnerLink') {
        route.component = InnerLink
      }
      else {
        route.component = loadView(route.component)
      }
    }
    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    }
    else {
      delete route.children
      delete route.redirect
    }
    return true
  })
}

/**
 * 过滤路由 children
 * @param childrenMap - 路由 children 映射
 * @param lastRouter - 上一个路由对象，默认为 false
 * @returns 过滤后的 children 数组
 */
function filterChildren(childrenMap: any, lastRouter: any = false) {
  let children: any = []
  childrenMap.forEach((el: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c: any) => {
          c.path = `${el.path}/${c.path}`
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = `${lastRouter.path}/${el.path}`
    }
    children = children.concat(el)
  })
  return children
}

/**
 * 动态路由遍历，验证是否具备权限
 * @param routes - 要过滤的路由数组
 * @returns 过滤后的路由数组
 */
export function filterDynamicRoutes(routes: any) {
  const res: any = []
  routes.forEach((route: any) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    }
    else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export function loadView(view: any) {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}
