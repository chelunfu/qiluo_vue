import request from '@/axios'

export enum CodeGenApi {
  scan = '/sys/codegen/scan',
  generate = '/sys/codegen/generate',
  saveConfig = '/sys/codegen/save_config',
  loadConfig = '/sys/codegen/load_config'
}

export interface FieldConfig {
  field_name: string
  show_in_list: boolean
  show_in_search: boolean
  show_in_form: boolean
  show_in_detail: boolean
  sortable?: boolean
  sort_priority?: number
  sort_order?: string // "asc" 或 "desc"
  component?: string
  required?: boolean
  min_length?: number
  max_length?: number
  pattern?: string
  pattern_message?: string
  relation_target?: string
  relation_display_field?: string
}

export const ScanEntities = () => {
  return request.get({ url: CodeGenApi.scan })
}

export const GenerateCode = (data: {
  module_name: string
  table_name: string
  enable_data_scope?: boolean
  field_config?: FieldConfig[]
}) => {
  return request.post({ url: CodeGenApi.generate, data })
}

export const SaveFieldConfig = (data: {
  module_name: string
  table_name: string
  field_config: FieldConfig[]
}) => {
  return request.post({ url: CodeGenApi.saveConfig, data })
}

export const LoadFieldConfig = (params: { module_name: string; table_name: string }) => {
  return request.get({ url: CodeGenApi.loadConfig, params })
}
