import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { BaseFC } from '@/types'
import { useUnionIs } from '@/hooks'

interface EmptyProps {
  title?: ReactNode
  size?: 'lg' | 'md' | 'sm'
}
export const Empty: BaseFC<EmptyProps> = (props) => {
  const { className, title = 'No Result', size = 'md', ...rest } = props
  const { isMd, isSm } = useUnionIs(size)
  return (
    <div className={clsx('mx-a text-center p-8', className)}>
      <div className="text-center text-3.5 c-primary">{title}</div>
    </div>
  )
}
