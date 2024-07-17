import type { ReactNode } from 'react'
import { Link, Route } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { cloneDeep, isFunction, pickBy } from 'lodash-es'
import { Tree } from '@libhub/utils'
import { genQueryString } from '@/utils/common/tools'

let id = 1
// 初始化路由对象, 添加fullpath和key
export function initRoutes(rawRoutes: RouteRecordRaw[]) {
  const routes = cloneDeep(rawRoutes)
  const processFn = (routes: RouteRecordRaw[], accumulatePath: string) => {
    routes.forEach((route) => {
      let parentsAccumulatePath = accumulatePath
      // 拼接当前路由与所有父路由的path
      if (route.path === '*') {
        return
      }
      if (route.path) {
        parentsAccumulatePath += `/${route.path}`
      }
      Reflect.set(route, 'fullpath', parentsAccumulatePath.replace(/\/{2,}/g, '/'))
      Reflect.set(route, 'key', id++)
      // const auth = route.meta?.auth
      // route.element = <AuthWrapper auth={auth}>{route.element}</AuthWrapper>
      if (route.children) {
        processFn(route.children, parentsAccumulatePath)
      }
    })
  }
  processFn(routes, '/')
  return routes as RouteRecord[]
}

// 过滤掉无权限以及需要隐藏的路由
export function filterRoutes(routeRecordRaw: RouteRecord[]) {
  const filter = (routes: RouteRecord[]) => {
    return routes.reduce<RouteRecord[]>((acc, route) => {
      const routeCopy = { ...route }
      const { meta, index } = routeCopy
      if (!meta?.hideInMenu && meta?.title) {
        if (routeCopy.children?.length) {
          routeCopy.children = filter(routeCopy.children)
        }
        if (
          // routeCopy.element&&
          (!routeCopy.children || !(Array.isArray(routeCopy.children) && routeCopy.children.length))
        ) {
          const { children: _, ...rest } = routeCopy
          acc.push(rest)
        } else if (
          !routeCopy.children
          || (Array.isArray(routeCopy.children) && routeCopy.children.length)
        ) {
          acc.push(routeCopy)
        }
      }
      return acc
    }, [])
  }
  return filter(routeRecordRaw)
}

// 生成侧边栏菜单组件能直接使用的菜单数组
export function genMenusByRoutes(
  routes: RouteRecord[],
  options?: {
    /**
     * 菜单显示层数(不会生成超过此层数的菜单)
     */
    lawyer?: number
  },
): MenuProps['items'] {
  const { lawyer = Number.POSITIVE_INFINITY } = options || {}
  const fn = (_routes: RouteRecord[]) => {
    return _routes.map(({ key, fullpath, meta, children }, index) => {
      const menuData: any = {
        children: undefined,
        icon: meta?.icon,
        key,
      }
      const paths = new Tree(routes).findPath((item) => item.key === key)
      const parents = paths.slice(0, paths.length - 1)
      // 不生成超过展示层数的菜单
      if (parents.length <= lawyer) {
        menuData.label = children?.length
          ? meta?.title
          : (
            <Link to={fullpath}>
              {meta?.title}
              {' '}
            </Link>
          )
        // 如果最后一层是可展示的菜单最后一层或者该菜单没有子菜单, 则必定是可以点击跳转的
        if (parents.length === lawyer || !children?.length) {
          menuData.label = (
            <Link to={fullpath}>
              {meta?.title}
              {' '}
            </Link>
          )
        } else {
          menuData.label = meta?.title
          if (children?.length) {
            menuData.children = fn(children)
          }
        }
      }
      return menuData
    })
  }
  return fn(routes)
}

// 生成react-router直接使用的路由
export function genRoutes(routes: RouteRecord[]): ReactNode {
  return routes.map(({ path, key, index, element, meta, children }) => {
    return (
      <Route key={key} element={element} index={index} path={path}>
        {children && genRoutes(children)}
      </Route>
    )
  })
}

/**
 * 通过路由对象解析出fullpath
 */
export function resoveFullpathFromRouteLoaction(
  routeLocation: RouteLocation,
  routes: RouteRecord[],
) {
  let fullpath = ''
  if (typeof routeLocation === 'string') {
    fullpath = routeLocation
  } else {
    // @ts-expect-error
    const { path, params, query, name, encodeQueryParams } = routeLocation || {}
    if (name) {
      const currentRoute = new Tree(routes).find((item) => item.name === name)
      if (!currentRoute) {
        return
      }
      fullpath = currentRoute.fullpath
    }
    if (path) {
      fullpath = path
    }
    if (params) {
      fullpath = fullpath
        .split('/')
        .map((item) => {
          const dynamicParams = item.split(':')[1]
          if (dynamicParams in params) {
            return params[dynamicParams]
          }
          return item
        })
        .join('/')
    }
    fullpath += query ? genQueryString(query, { encode: encodeQueryParams }) : ''
  }
  return fullpath
}

export function getCurrentTo(
  to: RouteLocation,
  route: RouteLocationNormalized,
  retainParams?: RouterOptions['retainParams'],
): RouteLocation {
  if (typeof to === 'string' || !retainParams) {
    return to
  }
  const { query, params, ...rest } = to
  const result = {
    params: { ...route.params, ...params },
    query: { ...route.query, ...query },
    ...rest,
  } as RouteLocationPath

  if (isFunction(retainParams)) {
    result.query = pickBy(result.query, (value, key) => retainParams({ key, type: 'query', value }))
    result.params = pickBy(result.params, (value, key) => retainParams({ key, type: 'params', value }))
  }
  return result
}
