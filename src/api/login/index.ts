import request from '@/axios'
import type { UserType, UserLoginParamType, CodeData } from './types'

export enum LoginApi {
  Login = '/sys/auth/login',
  GetCaptcha = '/sys/auth/get_captcha',
  GetAdminRole = '/sys/menu/all_router'
}

export const GetCaptcha = (params: any): Promise<IResponse<CodeData>> => {
  return request.get({ url: LoginApi.GetCaptcha, params })
}

export const PostLogin = (data: UserLoginParamType): Promise<IResponse<any>> => {
  return request.post({ url: LoginApi.Login, data })
}

export const GetAdminRole = (): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: LoginApi.GetAdminRole })
}
