import type { AxiosError, AxiosRequestConfig } from 'axios'
import { baseResponseInterceptor, createRequest } from './base'
import { notification } from '@/utils/common'

export const request = createRequest({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30 * 1000,
  // withCredentials: true, // send cookies when cross-domain requests
})

request.instance.interceptors.request.use(
  // @ts-expect-error
  (config: AxiosRequestConfig) => {
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

request.instance.interceptors.response.use(
  (response) => {
    const isSilentError = response.config.__silentError
    const status = Number(response.status)
    const statusCode = Number(response.data.code)
    if (!String(status).startsWith('2') || statusCode !== 1) {
      const msg = response.data.msg || ''
      !isSilentError && notification.error({ description: msg })
      return Promise.reject(msg)
    }
    return response.data.data
  },
  async (err: AxiosError<any>) => {
    console.log('request error', err)
    const isSilentError = err.response?.config.__silentError
    // const errCode = Number(err.response?.status)
    // const msg = err.response?.data.message || '网络错误'
    !isSilentError && notification.error({ description: err.message })
    return Promise.reject(err)
  },
)

export const binanceRequest = createRequest({
  baseURL: 'https://api.binance.com',
  timeout: 30 * 1000,
})
binanceRequest.instance.interceptors.response.use(baseResponseInterceptor)
