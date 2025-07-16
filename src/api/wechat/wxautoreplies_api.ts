import request from '@/axios'

export enum WxAutoRepliesApi {
  list = '/wechat/wxautoreplies/list',
  add = '/wechat/wxautoreplies/add',
  edit = '/wechat/wxautoreplies/edit',
  del = '/wechat/wxautoreplies/del'
}

export const GetWxAutoRepliesList = (params: any) => {
  return request.get({ url: WxAutoRepliesApi.list, params })
}

export const AddWxAutoReplies = (params: any) => {
  return request.post({ url: WxAutoRepliesApi.add, data: params })
}

export const EditWxAutoReplies = (params: any) => {
  return request.put({ url: WxAutoRepliesApi.edit, data: params })
}

export const DelWxAutoReplies = (params: any) => {
  return request.delete({ url: WxAutoRepliesApi.del, params })
}
