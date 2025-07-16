import request from '@/axios'

export enum WxAccountsApi {
  list = '/wechat/wxaccounts/list',
  add = '/wechat/wxaccounts/add',
  edit = '/wechat/wxaccounts/edit',
  del = '/wechat/wxaccounts/del'
}

export const GetWxAccountsList = (params: any) => {
  return request.get({ url: WxAccountsApi.list, params })
}

export const AddWxAccounts = (params: any) => {
  return request.post({ url: WxAccountsApi.add, data: params })
}

export const EditWxAccounts = (params: any) => {
  return request.put({ url: WxAccountsApi.edit, data: params })
}

export const DelWxAccounts = (params: any) => {
  return request.delete({ url: WxAccountsApi.del, params })
}
