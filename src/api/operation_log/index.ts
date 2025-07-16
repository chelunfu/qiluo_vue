import request from '@/axios'

export enum OperationLog {
  list = '/sys/operationlog/list',
  edit = '/sys/operationlog/edit',
  add = '/sys/operationlog/add',
  del = '/sys/operationlog/del'
}

export const GetOperationLogList = (params: any) => {
  return request.get({ url: OperationLog.list, params })
}

export const PutOperationLogEdit = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: OperationLog.edit, data })
}

export const PostOperationLogAdd = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: OperationLog.add, data })
}
