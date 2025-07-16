import request from '@/axios'
import { ref } from 'vue'
export enum DictDataApi {
  list = '/sys/dictdata/list',
  add = '/sys/dictdata/add',
  edit = '/sys/dictdata/edit',
  del = '/sys/dictdata/del',
  get_by_type = '/sys/dictdata/get_by_type'
}

export const GetDictDataList = (params: any) => {
  return request.get({ url: DictDataApi.list, params })
}

export const AddDictData = (params: any) => {
  return request.post({ url: DictDataApi.add, data: params })
}

export const EditDictData = (params: any) => {
  return request.put({ url: DictDataApi.edit, data: params })
}

export const DelDictData = (dict_code: string) => {
  return request.delete({ url: DictDataApi.del + '?dict_code=' + dict_code })
}

export const GetDictDataByType = (dict_type: string) => {
  return request.get({ url: DictDataApi.get_by_type + '?dict_type=' + dict_type })
}

export enum DictType {
  SysJob = 'sys_job',
  SysJobGroup = 'sys_job_group',
  SysLogcache = 'sys_logcache'
}

/**
 * 获取字典数据
 * @param dictTypes
 */
export const useDicts = (dictTypes: string) => {
  const data = ref([])
  GetDictDataByType(dictTypes)
    .then((res) => {
      data.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
  return data
}
