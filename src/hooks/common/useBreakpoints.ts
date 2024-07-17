import { useResponsive } from 'ahooks'

export function useBreakpoints() {
  const responsive = useResponsive() as Breakpoints
  return responsive
}
