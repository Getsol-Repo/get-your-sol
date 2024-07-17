import type { ReactNode } from 'react'
import { isNil } from 'lodash-es'
import clsx from 'clsx'
import { type UseCopyToClipboardOptions, useCopyToClipboard } from '@/hooks'
import type { BaseProps } from '@/types'

export interface CopyToClipboardProps extends BaseProps, UseCopyToClipboardOptions {
  text: string
  copiedNode?: ReactNode
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const { children, text, copiedNode, duration = 1500, className, onError, onSuccess, ...rest } = props
  const { copy, state, copied } = useCopyToClipboard({ duration, onError, onSuccess })

  return (
    <div
      className={clsx('inline-block leading-0', className)}
      onClickCapture={(e) => {
        e.preventDefault()
        if (copied && state.value === text) {
          return
        }
        copy(text)
      }}
      {...rest}
    >
      {!isNil(copiedNode) && state.value === text && copied ? copiedNode : children}
    </div>
  )
}
