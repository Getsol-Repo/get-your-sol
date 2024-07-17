import { useMemoizedFn } from 'ahooks'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useTrigger(delay: number) {
  const [active, setActive] = useState(false)
  const timer = useRef<NodeJS.Timeout>()
  const clear = useCallback(() => {
    clearTimeout(timer.current)
  }, [])

  const trigger = useMemoizedFn(async () => {
    if (active) {
      return
    }
    setActive(true)
    timer.current = setTimeout(() => {
      setActive(false)
    }, delay)
  })

  useEffect(() => {
    return clear
  }, [])

  return { active, clear, trigger }
}
