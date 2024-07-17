import { pick } from 'lodash-es'
import { useRef } from 'react'
import { shallow } from 'zustand/shallow'

export function useSelector<S extends object, P extends keyof S>(
  paths: P | readonly P[],
): (state: S) => Pick<S, P> {
  const prev = useRef({} as Pick<S, P>)

  return (state: S) => {
    if (state) {
      const next = pick(state, paths)
      return shallow(prev.current, next) ? prev.current : (prev.current = next)
    }
    return prev.current
  }
}

export default useSelector
