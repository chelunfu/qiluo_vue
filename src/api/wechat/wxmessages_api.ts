import request from '@/axios'

export enum WxMessagesApi {
  list = '/wechat/wxmessages/list',
  add = '/wechat/wxmessages/add',
  edit = '/wechat/wxmessages/edit',
  del = '/wechat/wxmessages/del'
}

export const GetWxMessagesList = (params: any) => {
  return request.get({ url: WxMessagesApi.list, params })
}

export const AddWxMessages = (params: any) => {
  return request.post({ url: WxMessagesApi.add, data: params })
}

export const EditWxMessages = (params: any) => {
  return request.put({ url: WxMessagesApi.edit, data: params })
}

export const DelWxMessages = (params: any) => {
  return request.delete({ url: WxMessagesApi.del, params })
}
