import request from '@/axios'

export enum WxMessagesApi {
  list = '/wechat/wxmessages/list',
  add = '/wechat/wxmessages/add',
  edit = '/wechat/wxmessages/edit',
  del = '/wechat/wxmessages/del',
  conversation = '/wechat/wxmessages/conversation',
  reply = '/wechat/wxmessages/reply'
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

export const GetConversation = (params: any) => {
  return request.get({ url: WxMessagesApi.conversation, params })
}

export const ReplyMessage = (data: any) => {
  return request.post({ url: WxMessagesApi.reply, data })
}
