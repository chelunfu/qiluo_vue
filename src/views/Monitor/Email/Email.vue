<script setup lang="tsx">
import { ref, reactive, onMounted, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
import {
  ElMessage,
  ElTag,
  ElDescriptions,
  ElDescriptionsItem,
  ElTabs,
  ElTabPane,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElMessageBox
} from 'element-plus'
import {
  SendEmail,
  SendTemplateEmail,
  GetMailerConfig,
  GetMailLogList,
  GetMailTemplateList,
  AddMailTemplate,
  EditMailTemplate,
  DeleteMailTemplate,
  MailerApi
} from '@/api/mailer'
import { hasPermi } from '@/components/Permission'
import { useTable } from '@/hooks/web/useTable'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'

const { t } = useI18n()
const { required } = useValidator()
const { email: emailValidator } = useValidator()

// ========== Tab 控制 ==========
const activeTab = ref('config')

// ========== 邮件配置 ==========
const configLoading = ref(false)
const mailerConfig = ref<any>(null)

const fetchConfig = async () => {
  configLoading.value = true
  try {
    const res = await GetMailerConfig()
    if (res && res.data) {
      mailerConfig.value = res.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    configLoading.value = false
  }
}

// ========== 发送邮件表单 ==========
const sendLoading = ref(false)
const sendFormSchema = ref<FormSchema[]>([
  {
    field: 'to',
    label: t('mailer.to'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.toPlaceholder')
    }
  },
  {
    field: 'subject',
    label: t('mailer.subject'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.subjectPlaceholder')
    }
  },
  {
    field: 'text',
    label: t('mailer.textContent'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4,
      placeholder: t('mailer.textContentPlaceholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'html',
    label: t('mailer.htmlContent'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 6,
      placeholder: t('mailer.htmlContentPlaceholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'from',
    label: t('mailer.from'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.fromPlaceholder')
    }
  },
  {
    field: 'reply_to',
    label: t('mailer.replyTo'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.replyToPlaceholder')
    }
  }
])

const sendRules = reactive({
  to: [required(), emailValidator()],
  subject: [required()],
  text: [required()],
  reply_to: [emailValidator()]
})

const { formRegister: sendFormRegister, formMethods: sendFormMethods } = useForm()
const { getFormData: getSendFormData, getElFormExpose: getSendElFormExpose } = sendFormMethods

const handleSend = async () => {
  const elForm = await getSendElFormExpose()
  const valid = await elForm?.validate().catch(() => {})
  if (!valid) return

  const formData = await getSendFormData()
  if (!formData) return

  sendLoading.value = true
  try {
    const res = await SendEmail(formData as any)
    if (res) {
      ElMessage.success(t('mailer.sendSuccess'))
    }
  } catch (e) {
    console.error(e)
  } finally {
    sendLoading.value = false
  }
}

// ========== 发送模板邮件表单 ==========
const templateLoading = ref(false)
const templateFormSchema = ref<FormSchema[]>([
  {
    field: 'to',
    label: t('mailer.to'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.toPlaceholder')
    }
  },
  {
    field: 'template_code',
    label: t('mailer.templateCode'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.templateCodePlaceholder')
    }
  },
  {
    field: 'locals',
    label: t('mailer.templateVars'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4,
      placeholder: t('mailer.templateVarsPlaceholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'from',
    label: t('mailer.from'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.fromPlaceholder')
    }
  },
  {
    field: 'reply_to',
    label: t('mailer.replyTo'),
    component: 'Input',
    componentProps: {
      placeholder: t('mailer.replyToPlaceholder')
    }
  }
])

const templateRules = reactive({
  to: [required(), emailValidator()],
  template_code: [required()],
  reply_to: [emailValidator()]
})

const { formRegister: templateFormRegister, formMethods: templateFormMethods } = useForm()
const { getFormData: getTemplateFormData, getElFormExpose: getTemplateElFormExpose } =
  templateFormMethods

const handleSendTemplate = async () => {
  const elForm = await getTemplateElFormExpose()
  const valid = await elForm?.validate().catch(() => {})
  if (!valid) return

  const formData = await getTemplateFormData()
  if (!formData) return

  // 将 locals 字符串解析为 JSON
  let locals = {}
  if (formData.locals) {
    try {
      locals = JSON.parse(formData.locals)
    } catch {
      ElMessage.error(t('mailer.invalidJson'))
      return
    }
  }

  templateLoading.value = true
  try {
    const res = await SendTemplateEmail({
      ...formData,
      locals
    } as any)
    if (res) {
      ElMessage.success(t('mailer.sendSuccess'))
    }
  } catch (e) {
    console.error(e)
  } finally {
    templateLoading.value = false
  }
}

// ========== 邮件日志列表 ==========
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'recipient',
    label: t('mailer.logRecipient'),
    component: 'Input'
  },
  {
    field: 'subject',
    label: t('mailer.logSubject'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('mailer.logStatus'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('mailer.statusPending'), value: 'pending' },
        { label: t('mailer.statusSuccess'), value: 'success' },
        { label: t('mailer.statusFailed'), value: 'failed' }
      ],
      clearable: true
    }
  },
  {
    field: 'mail_type',
    label: t('mailer.logMailType'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('mailer.typePlain'), value: 'plain' },
        { label: t('mailer.typeTemplate'), value: 'template' }
      ],
      clearable: true
    }
  }
])

const searchParams = ref<any>({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getLogList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetMailLogList({
      page_num: unref(tableState.page_num) as any,
      page_size: unref(tableState.page_size) as any,
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { getList: getLogList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('mailer.logIndex'),
    type: 'index'
  },
  {
    field: 'recipient',
    label: t('mailer.logRecipient'),
    minWidth: 180
  },
  {
    field: 'subject',
    label: t('mailer.logSubject'),
    minWidth: 200
  },
  {
    field: 'status',
    label: t('mailer.logStatus'),
    minWidth: 100,
    slots: {
      default: (data: any) => {
        const status = data.row.status
        const statusMap: Record<string, { type: any; label: string }> = {
          success: { type: 'success', label: t('mailer.statusSuccess') },
          failed: { type: 'danger', label: t('mailer.statusFailed') },
          pending: { type: 'warning', label: t('mailer.statusPending') }
        }
        const info = statusMap[status] || { type: 'info', label: status }
        return (
          <>
            <ElTag type={info.type}>{info.label}</ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'mail_type',
    label: t('mailer.logMailType'),
    minWidth: 100,
    slots: {
      default: (data: any) => {
        const type = data.row.mail_type
        return (
          <>
            <ElTag type={type === 'template' ? 'warning' : 'info'}>
              {type === 'template' ? t('mailer.typeTemplate') : t('mailer.typePlain')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'from_addr',
    label: t('mailer.logFrom'),
    minWidth: 180
  },
  {
    field: 'error_message',
    label: t('mailer.logError'),
    minWidth: 200,
    slots: {
      default: (data: any) => {
        const msg = data.row.error_message
        return msg ? <ElTag type="danger">{msg}</ElTag> : <span>-</span>
      }
    }
  },
  {
    field: 'created_at',
    label: t('mailer.logTime'),
    minWidth: 180
  }
])

// ========== 模板管理 ==========
const tplSearchParams = ref<any>({})
const setTplSearchParams = (data: any) => {
  tplSearchParams.value = data
  getTplList()
}

const tplSearchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('mailer.tplName'),
    component: 'Input'
  },
  {
    field: 'code',
    label: t('mailer.tplCode'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('mailer.tplStatus'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('mailer.enabled'), value: 1 },
        { label: t('mailer.disabled'), value: 0 }
      ],
      clearable: true
    }
  }
])

const {
  tableRegister: tplTableRegister,
  tableState: tplTableState,
  tableMethods: tplTableMethods
} = useTable({
  fetchDataApi: async () => {
    const res = await GetMailTemplateList({
      page_num: unref(tplTableState.page_num) as any,
      page_size: unref(tplTableState.page_size) as any,
      ...unref(tplSearchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const {
  dataList: tplDataList,
  loading: tplLoading,
  total: tplTotal,
  page_size: tplPageSize,
  page_num: tplPageNum
} = tplTableState
const { getList: getTplList } = tplTableMethods

const tplTableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('mailer.logIndex'),
    type: 'index'
  },
  {
    field: 'name',
    label: t('mailer.tplName'),
    minWidth: 150
  },
  {
    field: 'code',
    label: t('mailer.tplCode'),
    minWidth: 120
  },
  {
    field: 'subject',
    label: t('mailer.tplSubject'),
    minWidth: 200
  },
  {
    field: 'status',
    label: t('mailer.tplStatus'),
    minWidth: 80,
    slots: {
      default: (data: any) => {
        const status = data.row.status
        return (
          <ElTag type={status === 1 ? 'success' : 'danger'}>
            {status === 1 ? t('mailer.enabled') : t('mailer.disabled')}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'description',
    label: t('mailer.tplDescription'),
    minWidth: 150
  },
  {
    field: 'updated_at',
    label: t('mailer.tplUpdatedAt'),
    minWidth: 180
  },
  {
    field: 'action',
    label: t('mailer.tplEdit'),
    minWidth: 150,
    slots: {
      default: (data: any) => {
        return (
          <>
            <BaseButton type="primary" size="small" onClick={() => handleEditTpl(data.row)}>
              {t('mailer.tplEdit')}
            </BaseButton>
            <BaseButton type="danger" size="small" onClick={() => handleDeleteTpl(data.row)}>
              {t('mailer.tplDelete')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

// 模板编辑对话框
const tplDialogVisible = ref(false)
const tplDialogLoading = ref(false)
const tplFormRef = ref()
const tplFormData = reactive({
  id: 0,
  name: '',
  code: '',
  subject: '',
  text_content: '',
  html_content: '',
  description: '',
  status: 1
})
const isEdit = ref(false)

const tplFormRules = reactive({
  name: [required()],
  code: [required()],
  subject: [required()]
})

const resetTplForm = () => {
  tplFormData.id = 0
  tplFormData.name = ''
  tplFormData.code = ''
  tplFormData.subject = ''
  tplFormData.text_content = ''
  tplFormData.html_content = ''
  tplFormData.description = ''
  tplFormData.status = 1
  isEdit.value = false
}

const handleAddTpl = () => {
  resetTplForm()
  tplDialogVisible.value = true
}

const handleEditTpl = (row: any) => {
  isEdit.value = true
  tplFormData.id = row.id
  tplFormData.name = row.name
  tplFormData.code = row.code
  tplFormData.subject = row.subject
  tplFormData.text_content = row.text_content || ''
  tplFormData.html_content = row.html_content || ''
  tplFormData.description = row.description || ''
  tplFormData.status = row.status
  tplDialogVisible.value = true
}

const handleDeleteTpl = async (row: any) => {
  try {
    await ElMessageBox.confirm(t('mailer.tplDeleteConfirm'), t('mailer.tplDelete'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    const res = await DeleteMailTemplate(row.id)
    if (res) {
      ElMessage.success(t('mailer.tplDeleteSuccess'))
      getTplList()
    }
  } catch {
    // cancelled
  }
}

const handleTplSubmit = async () => {
  const valid = await tplFormRef.value?.validate().catch(() => {})
  if (!valid) return

  tplDialogLoading.value = true
  try {
    const data: any = {
      name: tplFormData.name,
      code: tplFormData.code,
      subject: tplFormData.subject,
      text_content: tplFormData.text_content || undefined,
      html_content: tplFormData.html_content || undefined,
      description: tplFormData.description || undefined,
      status: tplFormData.status
    }

    if (isEdit.value) {
      data.id = tplFormData.id
      const res = await EditMailTemplate(data)
      if (res) {
        ElMessage.success(t('mailer.tplEditSuccess'))
      }
    } else {
      const res = await AddMailTemplate(data)
      if (res) {
        ElMessage.success(t('mailer.tplAddSuccess'))
      }
    }
    tplDialogVisible.value = false
    getTplList()
  } catch (e) {
    console.error(e)
  } finally {
    tplDialogLoading.value = false
  }
}

// ========== 初始化 ==========
onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <div>
    <ElTabs v-model="activeTab" type="border-card">
      <!-- 邮件配置 -->
      <ElTabPane :label="t('mailer.configTitle')" name="config">
        <ContentWrap>
          <div v-if="configLoading">Loading...</div>
          <ElDescriptions v-else-if="mailerConfig" :column="2" border>
            <ElDescriptionsItem :label="t('mailer.smtpEnable')">
              <ElTag :type="mailerConfig.smtp?.enable ? 'success' : 'danger'">
                {{ mailerConfig.smtp?.enable ? t('mailer.enabled') : t('mailer.disabled') }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="t('mailer.stubMode')">
              <ElTag :type="mailerConfig.stub ? 'warning' : 'info'">
                {{ mailerConfig.stub ? t('mailer.enabled') : t('mailer.disabled') }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="mailerConfig.smtp" :label="t('mailer.smtpHost')">
              {{ mailerConfig.smtp.host }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="mailerConfig.smtp" :label="t('mailer.smtpPort')">
              {{ mailerConfig.smtp.port }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="mailerConfig.smtp" :label="t('mailer.smtpSecure')">
              <ElTag :type="mailerConfig.smtp.secure ? 'success' : 'info'">
                {{ mailerConfig.smtp.secure ? t('mailer.enabled') : t('mailer.disabled') }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="mailerConfig.smtp?.auth" :label="t('mailer.smtpUser')">
              {{ mailerConfig.smtp.auth.user }}
            </ElDescriptionsItem>
          </ElDescriptions>
          <div v-else>{{ t('mailer.noConfig') }}</div>
        </ContentWrap>
      </ElTabPane>

      <!-- 发送邮件 -->
      <ElTabPane :label="t('mailer.sendTitle')" name="send">
        <ContentWrap>
          <Form :rules="sendRules" @register="sendFormRegister" :schema="sendFormSchema" />
          <div class="mt-10px">
            <BaseButton
              v-if="hasPermi(MailerApi.send)"
              type="primary"
              :loading="sendLoading"
              @click="handleSend"
            >
              {{ t('mailer.sendBtn') }}
            </BaseButton>
          </div>
        </ContentWrap>
      </ElTabPane>

      <!-- 发送模板邮件 -->
      <ElTabPane :label="t('mailer.sendTemplateTitle')" name="template">
        <ContentWrap>
          <Form
            :rules="templateRules"
            @register="templateFormRegister"
            :schema="templateFormSchema"
          />
          <div class="mt-10px">
            <BaseButton
              v-if="hasPermi(MailerApi.send_template)"
              type="primary"
              :loading="templateLoading"
              @click="handleSendTemplate"
            >
              {{ t('mailer.sendTemplateBtn') }}
            </BaseButton>
          </div>
        </ContentWrap>
      </ElTabPane>

      <!-- 模板管理 -->
      <ElTabPane :label="t('mailer.templateTitle')" name="tpl">
        <ContentWrap>
          <div class="mb-10px">
            <BaseButton type="primary" @click="handleAddTpl">
              {{ t('mailer.tplAdd') }}
            </BaseButton>
          </div>
          <Search
            :schema="tplSearchSchema"
            @reset="setTplSearchParams"
            @search="setTplSearchParams"
          />
          <Table
            v-model:current-page="tplPageNum"
            v-model:page-size="tplPageSize"
            :columns="tplTableColumns"
            :data="tplDataList"
            :loading="tplLoading"
            :pagination="{ total: tplTotal }"
            @register="tplTableRegister"
          />
        </ContentWrap>
      </ElTabPane>

      <!-- 邮件日志 -->
      <ElTabPane :label="t('mailer.logTitle')" name="log">
        <ContentWrap>
          <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
          <Table
            v-model:current-page="page_num"
            v-model:page-size="page_size"
            :columns="tableColumns"
            :data="dataList"
            :loading="loading"
            :pagination="{
              total
            }"
            @register="tableRegister"
          />
        </ContentWrap>
      </ElTabPane>
    </ElTabs>

    <!-- 模板编辑对话框 -->
    <ElDialog
      v-model="tplDialogVisible"
      :title="isEdit ? t('mailer.tplEdit') : t('mailer.tplAdd')"
      width="700px"
    >
      <ElForm ref="tplFormRef" :model="tplFormData" :rules="tplFormRules" label-width="120px">
        <ElFormItem :label="t('mailer.tplName')" prop="name">
          <ElInput v-model="tplFormData.name" :placeholder="t('mailer.tplNamePlaceholder')" />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplCode')" prop="code">
          <ElInput
            v-model="tplFormData.code"
            :placeholder="t('mailer.tplCodePlaceholder')"
            :disabled="isEdit"
          />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplSubject')" prop="subject">
          <ElInput v-model="tplFormData.subject" :placeholder="t('mailer.tplSubjectPlaceholder')" />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplTextContent')">
          <ElInput
            v-model="tplFormData.text_content"
            type="textarea"
            :rows="4"
            :placeholder="t('mailer.tplTextPlaceholder')"
          />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplHtmlContent')">
          <ElInput
            v-model="tplFormData.html_content"
            type="textarea"
            :rows="6"
            :placeholder="t('mailer.tplHtmlPlaceholder')"
          />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplDescription')">
          <ElInput
            v-model="tplFormData.description"
            :placeholder="t('mailer.tplDescPlaceholder')"
          />
        </ElFormItem>
        <ElFormItem :label="t('mailer.tplStatus')">
          <ElSwitch
            v-model="tplFormData.status"
            :active-value="1"
            :inactive-value="0"
            :active-text="t('mailer.enabled')"
            :inactive-text="t('mailer.disabled')"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <BaseButton @click="tplDialogVisible = false">{{ t('common.cancel') }}</BaseButton>
        <BaseButton type="primary" :loading="tplDialogLoading" @click="handleTplSubmit">
          {{ t('common.confirm') }}
        </BaseButton>
      </template>
    </ElDialog>
  </div>
</template>
