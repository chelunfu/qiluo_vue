import request from '@/axios'

export enum WxUsersApi {
  list = '/wechat/wxusers/list',
  add = '/wechat/wxusers/add',
  edit = '/wechat/wxusers/edit',
  del = '/wechat/wxusers/del'
}

export const GetWxUsersList = (params: any) => {
  return request.get({ url: WxUsersApi.list, params })
}

export const AddWxUsers = (params: any) => {
  return request.post({ url: WxUsersApi.add, data: params })
}

export const EditWxUsers = (params: any) => {
  return request.put({ url: WxUsersApi.edit, data: params })
}

export const DelWxUsers = (params: any) => {
  return request.delete({ url: WxUsersApi.del, params })
}
