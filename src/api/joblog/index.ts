import request from '@/axios'

export enum JobLogApi {
  list = '/sys/jobinfo/list',
  add = '/sys/jobinfo/add',
  edit = '/sys/jobinfo/edit',
  del = '/sys/jobinfo/del'
}

export const GetJobLogList = (params: any) => {
  return request.get({ url: JobLogApi.list, params })
}

export const DelJobLog = (data: any) => {
  return request.delete({ url: JobLogApi.del, data })
}
