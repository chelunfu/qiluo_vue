import request from '@/axios'

export enum CacheApi {
  list = '/sys/cache/list',
  add = '/sys/jobinfo/add',
  edit = '/sys/jobinfo/edit',
  del = '/sys/jobinfo/del'
}

export const GetCacheList = (params: any) => {
  return request.get({ url: CacheApi.list, params })
}
