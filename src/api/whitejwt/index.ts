import request from '@/axios'

export enum UserOnlineApi {
  list = '/sys/useronline/list',
  del = '/sys/useronline/del'
}

export const GetUserOnlineList = (params: any) => {
  return request.get({ url: UserOnlineApi.list, params })
}
export const DelUserOnline = (data: any) => {
  return request.delete({ url: UserOnlineApi.del, data })
}
