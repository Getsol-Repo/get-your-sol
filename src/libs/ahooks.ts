import { configResponsive } from 'ahooks'

export function initAhooks() {
  configResponsive({
    xs: 375,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  })
}
