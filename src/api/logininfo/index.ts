import request from '@/axios'

export enum LoginInfoApi {
  list = '/sys/logininfo/list'
}

export const GetLoginInfoList = (params: any) => {
  return request.get({ url: LoginInfoApi.list, params })
}
