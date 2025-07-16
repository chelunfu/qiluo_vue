import request from '@/axios'

export enum RolePermissionApi {
  list = '/sys/roleapi/list',
  edit = '/sys/roleapi/edit',
  add = '/sys/roleapi/add',
  del = '/sys/roleapi/del',
  role_api_transfer_list = '/sys/roleapi/role_api_transfer_list',
  add_many_role_api_transfer = '/sys/roleapi/add_many_role_api_transfer',

  role_permission_list = '/sys/roleapi/role_permission_list'
}

export const GetRoleApiList = (params: any) => {
  return request.get({ url: RolePermissionApi.list, params })
}

export const PutRoleApiEdit = (data: any): Promise<IResponse<string>> => {
  return request.put({ url: RolePermissionApi.edit, data: data })
}

export const PostRoleApiAdd = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: RolePermissionApi.add, data })
}

export const role_api_transfer_list = (params: any) => {
  return request.get({ url: RolePermissionApi.role_api_transfer_list, params })
}

export const add_many_role_api_transfer = (data: any) => {
  return request.post({ url: RolePermissionApi.add_many_role_api_transfer, data })
}

export const role_permission_list = () => {
  return request.get({ url: RolePermissionApi.role_permission_list })
}
