import request from '@/axios'

export enum TestCategoryApi {
  list = '/test/test_category/list',
  add = '/test/test_category/add',
  edit = '/test/test_category/edit',
  del = '/test/test_category/del'
}

export const GetTestCategoryList = (params: any) => {
  return request.get({ url: TestCategoryApi.list, params })
}

export const AddTestCategory = (data: any) => {
  return request.post({ url: TestCategoryApi.add, data })
}

export const EditTestCategory = (data: any) => {
  return request.put({ url: TestCategoryApi.edit, data })
}

export const DelTestCategory = (params: any) => {
  return request.delete({ url: TestCategoryApi.del, params })
}
