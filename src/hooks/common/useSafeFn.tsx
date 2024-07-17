import { useMemoizedFn, useUnmountedRef } from 'ahooks'

/**
 * 防止在组件卸载后调用函数
 */
export function useSafeFn<T extends (this: any, ...args: any[]) => any>(_fn: T) {
  const unmountedRef = useUnmountedRef()
  const fn = useMemoizedFn(_fn)
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (unmountedRef.current) {
      return
    }
    return fn.apply(fn, args)
  }
}
