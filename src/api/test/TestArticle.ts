import request from '@/axios'

export enum TestArticleApi {
  list = '/test/test_article/list',
  add = '/test/test_article/add',
  edit = '/test/test_article/edit',
  del = '/test/test_article/del'
}

export const GetTestArticleList = (params: any) => {
  return request.get({ url: TestArticleApi.list, params })
}

export const AddTestArticle = (data: any) => {
  return request.post({ url: TestArticleApi.add, data })
}

export const EditTestArticle = (data: any) => {
  return request.put({ url: TestArticleApi.edit, data })
}

export const DelTestArticle = (params: any) => {
  return request.delete({ url: TestArticleApi.del, params })
}
