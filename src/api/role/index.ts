import request from '@/axios'

export enum RoleApi {
  list = '/sys/role/list',
  tree = '/sys/role/tree',
  get_role_menus = '/sys/role/get_role_menus',
  get_role_depts = '/sys/role/get_role_depts',
  edit = '/sys/role/edit',
  add = '/sys/role/add',
  del = '/sys/role/del',
  user_role_name_list = '/sys/role/user_role_name_list'
}
export const GetUserRoleName = () => {
  return request.get({ url: RoleApi.user_role_name_list })
}
export const GetRoleList = (params: any) => {
  return request.get({ url: RoleApi.list, params })
}
export const GetRoleTree = () => {
  return request.get({ url: RoleApi.tree })
}
export const get_role_menus_api = (params: any) => {
  return request.get({ url: RoleApi.get_role_menus, params })
}
export const get_role_depts = (params: any) => {
  return request.get({ url: RoleApi.get_role_depts, params })
}
export const PutRoleEditor = (data: any): Promise<IResponse<string>> => {
  return request.put({ url: RoleApi.edit, data: data })
}

export const PostRoleAdd = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: RoleApi.add, data })
}
