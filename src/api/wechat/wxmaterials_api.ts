import request from '@/axios'

export enum WxMaterialsApi {
  list = '/wechat/wxmaterials/list',
  add = '/wechat/wxmaterials/add',
  edit = '/wechat/wxmaterials/edit',
  del = '/wechat/wxmaterials/del',
  uploadTempMedia = '/wechat/wxmaterials/upload_temp_media',
  uploadPermanentMedia = '/wechat/wxmaterials/upload_permanent_media',
  uploadNews = '/wechat/wxmaterials/upload_news',
  syncMaterials = '/wechat/wxmaterials/sync_materials',
  materialCount = '/wechat/wxmaterials/material_count',
  deleteRemoteMedia = '/wechat/wxmaterials/delete_remote_media',
  uploadFile = '/wechat/wxmaterials/upload_file'
}

export const GetWxMaterialsList = (params: any) => {
  return request.get({ url: WxMaterialsApi.list, params })
}

export const AddWxMaterials = (params: any) => {
  return request.post({ url: WxMaterialsApi.add, data: params })
}

export const EditWxMaterials = (params: any) => {
  return request.put({ url: WxMaterialsApi.edit, data: params })
}

export const DelWxMaterials = (params: any) => {
  return request.delete({ url: WxMaterialsApi.del, params })
}

export const UploadTempMedia = (data: any) => {
  return request.post({ url: WxMaterialsApi.uploadTempMedia, data })
}

export const UploadPermanentMedia = (data: any) => {
  return request.post({ url: WxMaterialsApi.uploadPermanentMedia, data })
}

export const UploadNews = (data: any) => {
  return request.post({ url: WxMaterialsApi.uploadNews, data })
}

export const SyncMaterials = (data: any) => {
  return request.post({ url: WxMaterialsApi.syncMaterials, data })
}

export const MaterialCount = (data: any) => {
  return request.post({ url: WxMaterialsApi.materialCount, data })
}

export const DeleteRemoteMedia = (data: any) => {
  return request.post({ url: WxMaterialsApi.deleteRemoteMedia, data })
}

export const UploadFile = (formData: FormData) => {
  return request.post({
    url: WxMaterialsApi.uploadFile,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
