import { type FC, Suspense } from 'react'
import type { BaseProps } from '@/types'

export const AsyncComponent: FC<BaseProps> = ({ children }) => {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}
