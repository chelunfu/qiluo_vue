import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut, userToken } from '@/store/modules/user'
import { objToFormData } from '@/utils'

// 创建请求取消控制器映射
const abortControllerMap = new Map<string, AbortController>()
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH
// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: PATH_URL || '',
  timeout: 10000,
  withCredentials: false
})

// 获取错误信息的辅助函数
const getErrorMessage = (status: number): string => {
  const errorMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '权限不足，拒绝访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }
  return errorMessages[status] || `请求失败 (${status})`
}

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 数据转换处理
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    } else if (
      TRANSFORM_REQUEST_DATA &&
      config.method === 'post' &&
      config.headers['Content-Type'] === 'multipart/form-data' &&
      !(config.data instanceof FormData)
    ) {
      config.data = objToFormData(config.data)
    }

    // 2. 请求取消控制器设置
    const controller = new AbortController()
    const url = config.url || ''
    config.signal = controller.signal

    // 处理 mock 环境下的 URL
    const mapKey = import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url
    abortControllerMap.set(mapKey, controller)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<IResponse>) => {
    // 1. 清理请求取消控制器
    const url = response.config.url || ''
    abortControllerMap.delete(url)

    // 2. Token 刷新检查
    const { isExpiredSoon, refershtoken } = userToken()
    if (isExpiredSoon && !refershtoken) {
      // TODO: 实现 token 刷新逻辑
      useUserStoreWithOut().freshToken()
    }

    // 3. 文件流响应直接返回
    if (response?.config?.responseType === 'blob') {
      return response
    }

    // 4. HTTP 状态码检查
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      // HTTP 状态码错误
      const errorMessage = response.data?.message || getErrorMessage(response.status)
      ElMessage.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  },
  (error: AxiosError<IResponse>) => {
    console.log('HTTP Error in service interceptor:', error)

    // 清理请求取消控制器
    if (error.config?.url) {
      abortControllerMap.delete(error.config.url)
    }

    let errorMessage = '网络请求失败'

    if (error.response) {
      // 服务器响应了错误状态码
      const status = error.response.status
      const responseData = error.response.data

      // 优先使用后端返回的错误信息
      if (responseData && responseData.message) {
        errorMessage = responseData.message
      } else {
        errorMessage = getErrorMessage(status)
      }

      // 特殊处理 401 未授权
      if (status === 401) {
        const userStore = useUserStoreWithOut()
        userStore.logout()
        if (!responseData?.message) {
          errorMessage = '登录已过期，请重新登录'
        }
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请稍后重试'
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = '网络连接失败，请检查网络'
      } else if (error.name === 'AbortError') {
        // 请求被取消，不显示错误信息
        return Promise.reject(error)
      } else {
        errorMessage = '网络请求失败，请稍后重试'
      }
    } else {
      // 请求配置出错
      errorMessage = error.message || '请求配置错误'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  }
)

// 请求取消相关方法
const cancelRequest = (url: string | string[]) => {
  const urls = Array.isArray(url) ? url : [url]

  urls.forEach((u) => {
    const controller = abortControllerMap.get(u)
    if (controller) {
      controller.abort()
      abortControllerMap.delete(u)
    }
  })
}

const cancelAllRequest = () => {
  abortControllerMap.forEach((controller) => {
    controller.abort()
  })
  abortControllerMap.clear()
}

// 导出 service 对象
const service = {
  request: axiosInstance.request.bind(axiosInstance),
  get: axiosInstance.get.bind(axiosInstance),
  post: axiosInstance.post.bind(axiosInstance),
  put: axiosInstance.put.bind(axiosInstance),
  delete: axiosInstance.delete.bind(axiosInstance),
  patch: axiosInstance.patch.bind(axiosInstance),
  cancelRequest,
  cancelAllRequest
}

export default service
