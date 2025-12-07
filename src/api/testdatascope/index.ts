import request from '@/axios'

export enum TestDataScopeApi {
  list = '/test/test_data_scope/list',
  edit = '/test/test_data_scope/edit',
  add = '/test/test_data_scope/add',
  del = '/test/test_data_scope/del'
}

export const GetTestDataScopeList = (params: any) => {
  return request.get({ url: TestDataScopeApi.list, params })
}

export const PutTestDataScopeEditor = (data: any): Promise<IResponse<string>> => {
  return request.put({ url: TestDataScopeApi.edit, data: data })
}

export const PostTestDataScopeAdd = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: TestDataScopeApi.add, data })
}

export const DeleteTestDataScopeDel = (data: any): Promise<IResponse<any>> => {
  return request.delete({ url: TestDataScopeApi.del, params: data })
}
