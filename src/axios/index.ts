import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { AxiosResponse } from 'axios'

interface AxiosConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  params?: any
  data?: any
  headers?: Record<string, string>
  responseType?: 'json' | 'blob' | 'text' | 'stream' | 'document'
}

const request = async <T = any>(option: AxiosConfig): Promise<T> => {
  const { url, method, params, data, headers, responseType } = option

  const userStore = useUserStoreWithOut()

  const response = await service.request<T>({
    url: url,
    method,
    params,
    data: data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      ['Authorization']: userStore.getTokenType + ' ' + userStore.getToken,
      ...headers
    }
  })

  // 直接返回后端的 data 字段，如果没有则返回整个响应数据
  return response.data as T
}

export default {
  get: <T = any>(option: AxiosConfig): Promise<T> => {
    return request<T>({ method: 'get', ...option })
  },
  post: <T = any>(option: AxiosConfig): Promise<T> => {
    return request<T>({ method: 'post', ...option })
  },
  delete: <T = any>(option: AxiosConfig): Promise<T> => {
    return request<T>({ method: 'delete', ...option })
  },
  put: <T = any>(option: AxiosConfig): Promise<T> => {
    return request<T>({ method: 'put', ...option })
  },
  patch: <T = any>(option: AxiosConfig): Promise<T> => {
    return request<T>({ method: 'patch', ...option })
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
