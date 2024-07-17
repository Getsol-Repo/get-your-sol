import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    // 发生错误时不弹出错误提示
    __silentError?: boolean
  }
}
