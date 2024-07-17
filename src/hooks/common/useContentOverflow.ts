import { useState } from 'react'
import { useDebounceEffect, useSize } from 'ahooks'
import { type BasicTarget, getTargetElement } from '@/utils/common'

export function useContentOverflow(target: BasicTarget) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [hasEllipsis, setHasEllipsis] = useState(false)
  const size = useSize(target)
  useDebounceEffect(
    () => {
      const element = getTargetElement(target)
      if (element && element instanceof HTMLElement) {
        const isOverflowing = element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth
        const overflow = window.getComputedStyle(element).overflow
        const textOverflow = window.getComputedStyle(element).textOverflow
        // @ts-expect-error
        const lineClamp = window.getComputedStyle(element)['-webkit-line-clamp'] as string
        const hasEllipsis = overflow === 'hidden' && (textOverflow === 'ellipsis' || (lineClamp !== '' && lineClamp !== 'none'))
        setIsOverflowing(isOverflowing)
        setHasEllipsis(hasEllipsis)
      }
    },
    [size],
    { wait: 200, trailing: true, leading: false },
  )
  return { isOverflowing, hasEllipsis }
}
