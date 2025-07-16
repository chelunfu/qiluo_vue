import request from '@/axios'

export enum JobApi {
  list = '/sys/job/list',
  add = '/sys/job/add',
  edit = '/sys/job/edit',
  del = '/sys/job/del',
  validate_cron = '/sys/job/validate_cron',
  hand_execute_job = '/sys/job/hand_execute_job'
}

export const GetJobList = (params: any) => {
  return request.get({ url: JobApi.list, params })
}
export const AddJob = (data: any) => {
  return request.post({ url: JobApi.add, data })
}
export const EditJob = (data: any) => {
  return request.put({ url: JobApi.edit, data })
}
export const DelJob = (data: any) => {
  return request.delete({ url: JobApi.del, data })
}

export const PostValidateCron = (data: any) => {
  return request.post({ url: JobApi.validate_cron, data })
}

export const HandExecuteJob = (data: any) => {
  return request.post({ url: JobApi.hand_execute_job, data })
}
