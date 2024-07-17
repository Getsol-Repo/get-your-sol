import { useInViewport } from 'ahooks'
import clsx from 'clsx'
import { type HTMLAttributes, useEffect, useRef, useState } from 'react'
import type { BaseFC } from '@/types'

interface IntersectionObserverWrapperProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 元素出现在视口时应用的className
   */
  inViewportClassName?: string
  /**
   * 在视口外时隐藏
   */
  hiddenWhenOutViewport?: boolean
  rootMargin?: string
  onInViewportChange?: (inViewport?: boolean) => void
}
export const IntersectionObserverWrapper: BaseFC<IntersectionObserverWrapperProps> = ({
  className,
  inViewportClassName,
  hiddenWhenOutViewport = false,
  rootMargin = '0px 0px -200px 0px',
  onInViewportChange,
  ...rest
}) => {
  const ref = useRef(null)
  const [inViewport] = useInViewport(ref, { rootMargin })
  const [isIn, setIsIn] = useState(inViewport)
  useEffect(() => {
    if (!isIn) {
      setIsIn(inViewport)
      onInViewportChange?.(inViewport)
    }
  }, [inViewport])
  const isInVar = hiddenWhenOutViewport ? inViewport : isIn
  return (
    <div
      ref={ref}
      className={clsx(className, isInVar && inViewportClassName, !isInVar && 'invisible')}
      {...rest}
    />
  )
}
