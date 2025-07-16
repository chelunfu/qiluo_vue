import request from '@/axios'

export enum ApiUser {
  deptRoles = '/sys/user/depts_roles',
  edit = '/sys/user/edit',
  add = '/sys/user/add',
  getUserById = '/sys/user/list',
  resetPassword = '/sys/user/reset_password',
  changePassword = '/sys/user/change_password',
  delusers = '/sys/user/delusers',
  update_avatar = '/sys/user/update_avatar',
  refersh_token = '/sys/user/refersh_token',
  userinfo = '/sys/user/userinfo',
  login_out = '/sys/user/login_out',
  update_role_or_dept = '/sys/user/update_role_or_dept'
}

export const PostUpdateRoleOrDept = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: ApiUser.update_role_or_dept, data })
}
//根据部门Id获取用户
export const GetUserList = (params: any) => {
  return request.get({ url: ApiUser.getUserById, params })
}

export const GetDeptsRoles = (params: string): Promise<IResponse<any>> => {
  return request.get({ url: ApiUser.deptRoles + '?uid=' + params })
}

export const PutUserEdit = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: ApiUser.edit, data })
}

export const PostUserAdd = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: ApiUser.add, data })
}

export const PutResetPassword = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: ApiUser.resetPassword, data })
}
export const PutChagePassword = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: ApiUser.changePassword, data })
}

export const DelUsers = (uids: string[]) => {
  return request.delete({ url: ApiUser.delusers, data: { uids } })
}

export const PutUpdateAvatar = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: ApiUser.update_avatar, data })
}

export const PutRefershToken = (): Promise<IResponse<any>> => {
  return request.put({ url: ApiUser.refersh_token })
}

export const GetUserInfo = () => {
  return request.get({ url: ApiUser.userinfo })
}

export const GetLoginOut = () => {
  return request.get({ url: ApiUser.login_out })
}
