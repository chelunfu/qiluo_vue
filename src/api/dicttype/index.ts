import request from '@/axios'

export enum DictTypeApi {
  list = '/sys/dicttype/list',
  add = '/sys/dicttype/add',
  edit = '/sys/dicttype/edit',
  del = '/sys/dicttype/del'
}

export const GetDictTypeList = (params: any) => {
  return request.get({ url: DictTypeApi.list, params })
}

export const AddDictType = (params: any) => {
  return request.post({ url: DictTypeApi.add, data: params })
}

export const EditDictType = (params: any) => {
  return request.put({ url: DictTypeApi.edit, data: params })
}

export const DelDictType = (dict_id: string) => {
  return request.delete({ url: DictTypeApi.del + '?dict_id=' + dict_id })
}
