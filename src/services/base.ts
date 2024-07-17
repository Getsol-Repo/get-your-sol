import axios, { type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from 'axios'

export function createRequest(options?: CreateAxiosDefaults) {
  const instance = axios.create(options)
  return {
    delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.delete(url, { data, ...config })
    },
    get<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.get(url, {
        params: data,
        ...config,
      })
    },
    instance,
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.post(url, data, config)
    },
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.put(url, data, config)
    },
  }
}

export async function baseResponseInterceptor(response: AxiosResponse<any>) {
  return response.data
}
