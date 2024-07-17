import { isFunction } from 'lodash-es'
import { useState } from 'react'

export function useMergeState<T>(
  defaultStateValue: T | (() => T),
  options?: {
    defaultValue?: T | (() => T)
    value?: T
  },
) {
  const { defaultValue, value } = options || {}
  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) {
      return value
    }
    if (defaultValue !== undefined) {
      return isFunction(defaultValue) ? defaultValue() : defaultValue
    }
    return isFunction(defaultStateValue) ? defaultStateValue() : defaultStateValue
  })
  const mergedValue = value !== undefined ? value : innerValue
  return [mergedValue, setInnerValue] as const
}
