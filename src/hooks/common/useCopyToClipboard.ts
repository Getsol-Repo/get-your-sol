import { useState } from 'react'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { copyToClipboard } from '@/utils/common'

export interface UseCopyToClipboardOptions {
  duration?: number
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
}

export function useCopyToClipboard(options?: UseCopyToClipboardOptions) {
  const { duration = 1500, onSuccess, onError } = options || {}
  const [currentDuration, setCurrentDuration] = useState(duration)
  useUpdateEffect(() => {
    setCurrentDuration(duration)
  }, [duration])
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState<{
    value?: string
    error?: Error
  }>({})
  const copy = useMemoizedFn(async (text: string, options?: UseCopyToClipboardOptions) => {
    try {
      const { duration } = { duration: currentDuration, ...options }
      await copyToClipboard(text)
      onSuccess?.(text)
      setCopied(true)
      setState({ value: text })
      setTimeout(() => {
        setCopied(false)
      }, duration)
    } catch (e: any) {
      onError?.(e)
      setState({ error: e })
    }
  })
  return { copied, copy, state }
}
