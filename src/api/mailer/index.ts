import request from '@/axios'

export enum MailerApi {
  send = '/sys/mailer/send',
  send_template = '/sys/mailer/send_template',
  config = '/sys/mailer/config',
  log_list = '/sys/mailer/log_list',
  template_list = '/sys/mailer/template/list',
  template_add = '/sys/mailer/template/add',
  template_edit = '/sys/mailer/template/edit',
  template_del = '/sys/mailer/template/del'
}

export interface SendEmailData {
  to: string
  subject: string
  text: string
  html?: string
  from?: string
  reply_to?: string
}

export interface SendTemplateEmailData {
  to: string
  template_code: string
  from?: string
  reply_to?: string
  locals: Record<string, any>
}

export interface MailerConfig {
  smtp: {
    enable: boolean
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      password: string
    } | null
  } | null
  stub: boolean
  message?: string
}

export interface MailLogItem {
  id: number
  recipient: string
  subject: string
  content_text: string | null
  content_html: string | null
  from_addr: string | null
  reply_to: string | null
  status: string
  error_message: string | null
  mail_type: string | null
  created_by: number | null
  created_at: string
}

export interface MailLogListParams {
  page_num?: number
  page_size?: number
  recipient?: string
  subject?: string
  status?: string
  mail_type?: string
}

export interface MailTemplateItem {
  id: number
  name: string
  code: string
  subject: string
  text_content: string | null
  html_content: string | null
  description: string | null
  status: number
  created_at: string
  updated_at: string
}

export interface MailTemplateListParams {
  page_num?: number
  page_size?: number
  name?: string
  code?: string
  subject?: string
  status?: number
}

export interface AddMailTemplateData {
  name: string
  code: string
  subject: string
  text_content?: string
  html_content?: string
  description?: string
  status?: number
}

export interface EditMailTemplateData {
  id: number
  name?: string
  code?: string
  subject?: string
  text_content?: string
  html_content?: string
  description?: string
  status?: number
}

/** 发送邮件 */
export const SendEmail = (data: SendEmailData) => {
  return request.post({ url: MailerApi.send, data })
}

/** 发送模板邮件 */
export const SendTemplateEmail = (data: SendTemplateEmailData) => {
  return request.post({ url: MailerApi.send_template, data })
}

/** 获取邮件配置 */
export const GetMailerConfig = () => {
  return request.get({ url: MailerApi.config })
}

/** 获取邮件日志列表 */
export const GetMailLogList = (params: MailLogListParams) => {
  return request.get({ url: MailerApi.log_list, params })
}

/** 获取邮件模板列表 */
export const GetMailTemplateList = (params: MailTemplateListParams) => {
  return request.get({ url: MailerApi.template_list, params })
}

/** 新增邮件模板 */
export const AddMailTemplate = (data: AddMailTemplateData) => {
  return request.post({ url: MailerApi.template_add, data })
}

/** 编辑邮件模板 */
export const EditMailTemplate = (data: EditMailTemplateData) => {
  return request.put({ url: MailerApi.template_edit, data })
}

/** 删除邮件模板 */
export const DeleteMailTemplate = (id: string) => {
  return request.delete({ url: MailerApi.template_del + '?id=' + id })
}
