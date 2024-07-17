/* eslint-disable react-refresh/only-export-components */
import { withAsync } from '@/components'
import { homeRoutes } from '@/features/home/routes'

const Layout = withAsync(() => import('@/layouts'))

// 未经处理的路由记录(未添加key与fullpath)
export const routeRecordRaw: RouteRecordRaw[] = [
  {
    children: [
      ...homeRoutes,
    ],
    element: <Layout />,
    meta: {},
    path: '/',
  },
]
