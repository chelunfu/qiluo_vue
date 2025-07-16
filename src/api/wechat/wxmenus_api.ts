import request from '@/axios'

export enum WxMenusApi {
  list = '/wechat/wxmenus/list',
  add = '/wechat/wxmenus/add',
  edit = '/wechat/wxmenus/edit',
  del = '/wechat/wxmenus/del'
}

export const GetWxMenusList = (params: any) => {
  return request.get({ url: WxMenusApi.list, params })
}

export const AddWxMenus = (params: any) => {
  return request.post({ url: WxMenusApi.add, data: params })
}

export const EditWxMenus = (params: any) => {
  return request.put({ url: WxMenusApi.edit, data: params })
}

export const DelWxMenus = (params: any) => {
  return request.delete({ url: WxMenusApi.del, params })
}
