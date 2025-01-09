import type { RouteRecordRaw } from 'vue-router'

interface MyRouteRecordRawInterface {
  hidden?: boolean
  alwaysShow?: boolean
  permissions?: any[]
}

export declare type MyRouteRecordRaw = MyRouteRecordRawInterface &
  RouteRecordRaw

export declare interface MockMenu {
  path: string
  name: string
  component: string
  hidden?: boolean
  permissions?: any[]
  alwaysShow?: boolean
  redirect?: string
  children?: MockMenu[]
  meta?: Meta
}

interface Meta {
  title?: string
  icon?: string
  keepAlive?: boolean
  customBg?: boolean
  customBread?: any
  activeMenu?: string
  showTag?: boolean
}
