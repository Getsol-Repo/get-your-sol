import { unionIs } from '@libhub/utils'
import { useMemo } from 'react'

/**
 * 传入联合类型会返回类型提示以及{isXxx:true}这种形式的返回值
 */
export function useUnionIs<T extends string>(unionType: T) {
  return useMemo(() => unionIs(unionType), [unionType])
}
