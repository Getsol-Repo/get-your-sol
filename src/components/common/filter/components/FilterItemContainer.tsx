import type { ReactNode } from 'react'
import type { BaseFC } from '@/types'

interface FilterItemContainerProps {
  label?: ReactNode
}
export const FilterItemContainer: BaseFC<FilterItemContainerProps> = ({ label, children }) => {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: '.5rem' }}>
      <span style={{ flexShrink: 0, fontSize: 16 }}>{label}</span>
      {children}
    </div>
  )
}
