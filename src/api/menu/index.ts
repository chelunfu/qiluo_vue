import request from '@/axios'

export enum ApiMenu {
  edit = '/sys/menu/edit',
  add = '/sys/menu/add',
  del = '/sys/menu/del',
  list = '/sys/menu/list',
  tree = '/sys/menu/tree'
}
export const PutMenuEditor = (params: any): Promise<IResponse<string>> => {
  return request.put({ url: ApiMenu.edit, data: params })
}

export const PostMenuAdd = (params: any): Promise<IResponse<string>> => {
  return request.post({ url: ApiMenu.add, data: params })
}

export const DelMenu = (id: string) => {
  return request.delete({ url: ApiMenu.del + '?id=' + id })
}

export const GetMenuList = () => {
  return request.get({ url: ApiMenu.list })
}

export const GetMenuTree = () => {
  return request.get({ url: ApiMenu.tree })
}
