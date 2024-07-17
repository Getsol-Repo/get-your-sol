/* eslint-disable react-refresh/only-export-components */
import { withAsync } from '@/components'

const Main = withAsync(() => import('../'))

export const homeRoutes: RouteRecordRaw[] = [
  {
    element: <Main />,
    path: '',
  },
]
