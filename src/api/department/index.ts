import request from '@/axios'

export enum ApiDept {
  DeptList = '/sys/dept/list',
  DeptTree = '/sys/dept/dept_tree',

  DeptEdit = '/sys/dept/edit',
  DeptAdd = '/sys/dept/add',
  DelDept = '/sys/dept/del',
  user_dept_name_list = '/sys/dept/user_dept_name_list'
}

export const GetUserDeptName = () => {
  return request.get({ url: ApiDept.user_dept_name_list })
}
//获取部门树
export const GetDeptTree = () => {
  return request.get({ url: ApiDept.DeptTree })
}

export const PutDeptEdit = (data: any) => {
  return request.put({ url: ApiDept.DeptEdit, data })
}

export const PostDeptAdd = (data: any) => {
  return request.post({ url: ApiDept.DeptAdd, data })
}

export const DelDept = (ids: string[]) => {
  return request.delete({ url: ApiDept.DelDept, data: { ids } })
}

export const GetDeptList = (params: any) => {
  return request.get({ url: ApiDept.DeptList, params })
}
