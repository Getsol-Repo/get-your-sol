import type { ReactNode } from 'react'

export interface IRouterContext {
  routes: RouteRecord[]
}
export interface RouterProviderProps {
  routes: RouteRecordRaw[]
  children?: ReactNode
}
