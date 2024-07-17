import { Tooltip, type TooltipProps } from 'antd'
import type { ReactNode } from 'react'
import type { BaseFC } from '@/types'
import { isReactNode } from '@/utils/common/is'

export interface TooltipWrapperProps {
  tooltip?: ReactNode | TooltipProps
}

export const TooltipWrapper: BaseFC<TooltipWrapperProps> = ({ tooltip, ...rest }) => {
  if (tooltip === undefined) {
    return <> {rest.children}</>
  }
  if (isReactNode(tooltip)) {
    return <Tooltip title={tooltip} {...rest} />
  }
  return <Tooltip {...tooltip} {...rest} />
}
