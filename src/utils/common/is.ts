import { isObject } from 'lodash-es'
import { type ReactNode, isValidElement } from 'react'

const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isBigInt(val: unknown): val is bigint {
  return val !== null && is(val, 'File')
}

export function isUrl(path: string): boolean {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export function isReactNode(object: unknown): object is ReactNode {
  return isValidElement(object) || !isObject(object)
}

export function isBrowser() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement)
}
