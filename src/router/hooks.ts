import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

// import { useRouterContext } from './context'
import { getCurrentTo, resoveFullpathFromRouteLoaction } from './utils'
import { useRouterStore } from './store'
import { parseQueryString } from '@/utils/common'

export function useRoute(): RouteLocationNormalized {
  const location = useLocation()
  const routes = useRouterStore(({ routes }) => routes)
  const matchedRoutes = useMemo(
    () => (matchRoutes(routes, location) || []) as MatchedRoutes[],
    [routes, location],
  )
  const { route, ...otherParams } = matchedRoutes[matchedRoutes.length - 1] || {}
  const searchParams = parseQueryString(location.search)
  return {
    ...route,
    ...otherParams,
    location,
    matched: matchedRoutes,
    query: searchParams,
  }
}

export function useRouter(): Router {
  const routes = useRouterStore(({ routes }) => routes)
  const navigate = useNavigate()
  const route = useRoute()

  /**
   * 通过路由对象解析出fullpath
   */
  const resolve: Router['resolve'] = (to, options) => {
    const { retainParams } = options || {}
    return {
      href: resoveFullpathFromRouteLoaction(getCurrentTo(to, route, retainParams), routes),
    }
  }
  const jump = (to: RouteLocation, options?: RouterOptions) => {
    const fullpath = resolve(to, options).href
    if (fullpath === undefined) {
      console.warn('Location not found')
    }
    navigate(fullpath!, options)
  }
  const push: Router['push'] = (to, options) => jump(to, options)
  const replace: Router['replace'] = (to, options) => jump(to, { ...options, replace: true })

  const back = () => navigate(-1)
  const forward = () => navigate(1)
  const go: Router['go'] = (delta) => navigate(delta)
  const getRoutes = () => routes
  return { back, forward, getRoutes, go, push, replace, resolve }
}
