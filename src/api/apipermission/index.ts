import request from '@/axios'

export enum ApiPermissionApi {
  list = '/sys/apipermission/list',
  add = '/sys/apipermission/add',
  edit = '/sys/apipermission/edit',
  del = '/sys/apipermission/del'
}

export const ApiPermissionList = (params: any) => {
  return request.get({ url: ApiPermissionApi.list, params })
}

export const AddApiPermission = (params: any) => {
  return request.post({ url: ApiPermissionApi.add, data: params })
}

export const EditApiPermission = (params: any) => {
  return request.put({ url: ApiPermissionApi.edit, data: params })
}

export const DelApiPermission = (params: any) => {
  return request.delete({ url: ApiPermissionApi.del, data: params })
}
