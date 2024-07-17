import { type ReactNode, useRef } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { useMemoizedFn } from 'ahooks'
import { type BasicTarget, getTargetElement } from '@/utils/common'

export interface UseOverlayOptions {
  content?: ReactNode
  target?: BasicTarget
  afterClose?: () => void
  className?: string
  maskClosable?: boolean
  onCancel?: () => void
}
export function useOverlay(options?: UseOverlayOptions) {
  const {
    content,
    target,
    afterClose,
    className = '',
    maskClosable = false,
    onCancel,
  } = options || {}
  const overlayElementRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<Root | null>(null)

  const destroy = useMemoizedFn(() => {
    if (overlayElementRef.current) {
      overlayElementRef.current.style.opacity = '0'
      onCancel?.()
      setTimeout(() => {
        rootRef.current?.unmount()
        rootRef.current = null
        if (overlayElementRef.current) {
          overlayElementRef.current.parentNode?.removeChild(overlayElementRef.current)
        }
        afterClose?.()
      }, 300)
    }
  })

  const open = useMemoizedFn(() => {
    const el = document.createElement('div')
    el.className = className
    el.style.position = 'absolute'
    el.style.inset = '0'
    el.style.transition = 'all .3s'
    el.style.zIndex = '1000'
    if (maskClosable) {
      el.addEventListener('click', () => destroy())
    }
    rootRef.current = createRoot(el)
    rootRef.current.render(content)
    const targetEl = getTargetElement(target) || document.body
    targetEl.appendChild(el)
    requestAnimationFrame(() => {
      el.style.background = 'rgba(0, 0, 0, 0.5)'
    })
    overlayElementRef.current = el
  })

  return { open, destroy }
}
