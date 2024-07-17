/**
 * 从查询字符串中解析出query
 */
export function parseQueryString<T extends Record<string, string>>(url: string) {
  const rawParams: string | undefined = url.split('?')[1]
  return (rawParams?.split('&').reduce<Record<string, string>>((accumulator, item) => {
    const paramsArr = item.split('=')
    const key = paramsArr[0]
    if (key) {
      accumulator[key] = paramsArr[1] || ''
    }

    return accumulator
  }, {}) || {}) as Partial<T>
}

/**
 * 通过对象生成查询字符串
 */
export function genQueryString(obj: Record<string, any>, options?: { encode?: boolean }) {
  const { encode } = options || {}
  const arr = Object.keys(obj)
  if (arr.length) {
    const result = arr.reduce((acc, item, index) => {
      if (index === arr.length - 1) {
        acc += `${item}=${obj[item]}`
      } else {
        acc += `${item}=${obj[item]}&`
      }

      return acc
    }, '?')
    return encode ? result[0] + encodeURIComponent(result.slice(1)) : result
  }
  return ''
}

export async function copyToClipboard(text?: string) {
  if (!text) {
    return
  }
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const copyableDom: HTMLInputElement = document.createElement('input')
    document.body.appendChild(copyableDom)
    copyableDom.style.opacity = '0'
    copyableDom.setAttribute('value', text)
    copyableDom.focus()
    copyableDom.setSelectionRange(0, text.length)
    const result = document.execCommand('copy')
    document.body.removeChild(copyableDom)
    if (!result) {
      return Promise.reject(new Error('copy to clipboard fail'))
    }
  }
}

export function getSystemInfo() {
  const userAgent = window.navigator.userAgent
  let os: 'others' | 'windows' | 'macOS' | 'iOS' | 'android'
  let platform: 'pc' | 'mobile'
  if (/Windows/i.test(userAgent)) {
    os = 'windows'
  } else if (/Mac/i.test(userAgent)) {
    os = 'macOS'
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS'
  } else if (/Android/i.test(userAgent)) {
    os = 'android'
  } else {
    os = 'others'
  }
  if (os === 'windows' || os === 'macOS') {
    platform = 'pc'
  } else {
    platform = 'mobile'
  }
  return { os, platform }
}

export function zustandSet<T, K extends keyof T>(
  set: (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    // action?: A | undefined,
  ) => void,
  k: K,
  paylod: T[K] | ((prev: T[K]) => T[K]),
) {
  set((prev) => {
    const state = typeof paylod === 'function' ? (paylod as (prev: T[K]) => T[K])(prev[k]) : paylod
    return {
      ...prev,
      [k]: state,
    }
  })
}

export function getScrollbarWidth() {
  // 创建一个临时的div元素
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // 强制有滚动条
  document.body.appendChild(outer)

  // 创建一个内部的div元素，并添加到外部div中
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // 计算滚动条的宽度
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // 移除临时创建的元素
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
export function getBodyScrollbarWidth() {
  return document.documentElement.offsetWidth - document.documentElement.clientWidth
}
export function getWindowScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}
