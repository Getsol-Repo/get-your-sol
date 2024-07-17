import type { AxiosRequestConfig } from 'axios'
import { baseResponseInterceptor, createRequest } from '../base'

export const heliusRequest = createRequest({
  // baseURL: 'https://api.helius.xyz/v0',
  baseURL: 'https://helius-api-proxy.takitaki.space/v0',
  timeout: 30 * 1000,
  // withCredentials: true, // send cookies when cross-domain requests
})

heliusRequest.instance.interceptors.request.use(
  // @ts-expect-error
  (config: AxiosRequestConfig) => {
    // config.url = `${config.url}?api-key=${ENV_VARS.VITE_HELIUS_API_KEY}`
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

heliusRequest.instance.interceptors.response.use(baseResponseInterceptor)
