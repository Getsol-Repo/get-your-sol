import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { createBaseStore } from '@/store'

export interface RouterState {
  routes: RouteRecord[]
}

export interface RouterActions {
  setRoutes: (payload: RouterState['routes']) => void
}

export type RouterStore = RouterState & RouterActions & BaseStoreState & BaseStoreActions

const initState: RouterState = {
  routes: [],
}

export const useRouterStore = createWithEqualityFn<RouterStore>()(
  devtools(
    (set, get) => ({
      ...createBaseStore(initState)(set, get),
      setRoutes(payload) {
        set({ routes: payload })
      },
    }),
    { name: import.meta.env.PROD ? undefined : 'RouterStore' },
  ),
  shallow,
)
