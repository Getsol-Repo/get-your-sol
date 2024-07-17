import { Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useTitle } from 'ahooks'
import { genRoutes, initRoutes } from './utils'
import type { RouterProviderProps } from './type'
import { useRoute, useRouter } from './hooks'
import { useRouterStore } from './store'
import { useSelector } from '@/hooks'

export function RouterPage() {
  const router = useRouter()
  const { meta, redirect } = useRoute()
  const title = meta?.title
  const appName = import.meta.env.VITE_APP_NAME
  useTitle(title ? `${title} - ${appName}` : appName)
  return <Routes>{genRoutes(router.getRoutes())}</Routes>
}

export function RouterProvider({ routes, children, ...rest }: RouterProviderProps) {
  const { setRoutes } = useRouterStore(useSelector(['setRoutes']))
  useEffect(() => {
    setRoutes(initRoutes(routes))
  }, [routes])

  return children
}
