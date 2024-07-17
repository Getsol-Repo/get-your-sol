import type { Location, NavigateOptions, RouteMatch } from 'react-router-dom'
import type { StrictOmit } from '../tools'

declare global {
  interface RouteMeta {
    title?: string
    icon?: React.ReactNode
    /**
     * 该路由对应的页面是否显示面包屑
     */
    hideBreadcrumb?: boolean
    /**
     * 是否在菜单中隐藏
     */
    hideInMenu?: boolean
    /**
     * 是否需要登录才能访问
     */
    requireLogin?: boolean
  }

  type RouteRecordRaw = {
    /**
     * 路由唯一标识
     */
    name?: string
    caseSensitive?: boolean
    children?: RouteRecordRaw[]
    element?: React.ReactNode
    meta?: RouteMeta
    redirect?: { name: string }
  } & (
    | {
      index?: false
      path: string
    }
    | {
      index?: true
      path?: string
    }
  )
  type RouteRecord = {
    /**
     * 路由唯一标识
     */
    name?: string
    fullpath: string
    key: string
    children?: RouteRecord[]
    caseSensitive?: boolean
    element?: React.ReactNode
    meta?: RouteMeta
    redirect?: { name: string }
  } & (
    | {
      index?: false
      path?: string
    }
    | {
      index?: true
      path?: string
    }
  )

  interface MatchedRoutes extends RouteMatch<string, RouteRecord> {}

  /**
   * 路由Location对象
   */
  type RouteLocationNormalized = RouteRecord & {
    matched: MatchedRoutes[]
    location: Location
    query: Partial<Record<string, string>>
  } & Omit<MatchedRoutes, 'route'>

  type RouteLocationPath =
    | {
      path: string
      query?: Record<string, string | number | undefined>
      params?: Record<string, string | number | undefined>
      /**
       * 是否对查询参数编码
       */
      encodeQueryParams?: boolean
    }
    | {
      name: string
      query?: Record<string, string | number | undefined>
      params?: Record<string, string | number | undefined>
      /**
       * 是否对查询参数编码
       */
      encodeQueryParams?: boolean
    }
  type RouteLocation = string | RouteLocationPath

  interface RouterOptions extends NavigateOptions {
    /**
     * 保留现有路由上的所有参数 是函数时每一个路由参数都会传入该函数 返回真值则保留该参数
     */
    retainParams?:
      | boolean
      | ((info: {
        value: string | number | undefined
        key: string
        type: 'params' | 'query'
      }) => unknown)
  }

  interface Router {
    resolve: (
      to: RouteLocation,
      options?: Pick<RouterOptions, 'retainParams'>,
    ) => { href: string | undefined }
    push: (to: RouteLocation, options?: RouterOptions) => void
    replace: (to: RouteLocation, options?: StrictOmit<RouterOptions, 'replace'>) => void
    back: () => void
    forward: () => void
    go: (delta: number) => void
    getRoutes: () => RouteRecord[]
  }
}
