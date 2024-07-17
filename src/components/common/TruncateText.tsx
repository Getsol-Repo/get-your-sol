import { type HTMLAttributes, useRef } from 'react'
import clsx from 'clsx'
import { Tooltip, type TooltipProps } from 'antd'
import { useContentOverflow } from '@/hooks'

interface TruncateTextProps extends HTMLAttributes<HTMLDivElement> {
  tooltip?: false | string
  tooltipProps?: TooltipProps
}

export function TruncateText(props: TruncateTextProps) {
  const { children, className, tooltip, tooltipProps, ...rest } = props
  const ref = useRef<HTMLDivElement>(null)
  const { isOverflowing, hasEllipsis } = useContentOverflow(ref)
  const showTooltip = isOverflowing && hasEllipsis && tooltip !== false
  const el = (
    <div
      ref={ref}
      className={clsx(className && !/^truncate(-\d+)?$/.test(className) && 'truncate-1', className)}
      {...rest}
    >
      {children}
    </div>
  )

  return showTooltip ? (
    <Tooltip
      title={tooltip ?? typeof children === 'string' ? children : undefined}
      {...tooltipProps}
    >
      {el}
    </Tooltip>
  ) : (
    el
  )
}
