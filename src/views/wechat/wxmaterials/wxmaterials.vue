<script setup lang="tsx">
import { reactive, ref, unref, onMounted } from 'vue'
import {
  GetWxMaterialsList,
  AddWxMaterials,
  EditWxMaterials,
  DelWxMaterials,
  SyncMaterials,
  MaterialCount,
  DeleteRemoteMedia
} from '@/api/wechat/wxmaterials_api'
import { GetWxAccountsList } from '@/api/wx_accounts'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema, Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'

const { t } = useI18n()

// ====== 公众号选择 ======
const accountIdFormSchema = reactive<FormSchema[]>([
  {
    field: 'account_id',
    label: t('wx_materials.account_id'),
    component: 'Select',
    componentProps: {
      filterable: true,
      clearable: true,
      placeholder: t('wx_materials.account_id')
    },
    optionApi: async () => {
      const res = await GetWxAccountsList({ page_num: 1, page_size: 100 })
      return (res.data.list || []).map((item: any) => ({
        label: item.account_name,
        value: item.id
      }))
    },
    colProps: {
      span: 8
    }
  }
])

const { formRegister: accountFormRegister, formMethods: accountFormMethods } = useForm()
const { getFormData: getAccountFormData } = accountFormMethods

const selectedAccountId = ref<string>('')

const refreshAccountId = async () => {
  try {
    const data = await getAccountFormData()
    selectedAccountId.value = data?.account_id || ''
  } catch {
    // ignore
  }
}

onMounted(async () => {
  setTimeout(async () => {
    await refreshAccountId()
    if (selectedAccountId.value) {
      getList()
    }
  }, 500)
})

// ====== 搜索参数 ======
const searchParams = ref<any>({})

// ====== 表格 ======
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params: any = {
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    }
    if (selectedAccountId.value) {
      params.account_id = selectedAccountId.value
    }
    const res = await GetWxMaterialsList(params)
    return {
      list: res.data && res.data.list ? res.data.list : [],
      total: res.data && res.data.total ? res.data.total : 0
    }
  },
  fetchDelApi: async () => {
    const res = await DelWxMaterials(unref(id) as string)
    return !!res
  }
})
const { dataList, loading, total, page_size, page_num } = tableState
const { getList, delList } = tableMethods

// ====== 表格列 ======
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'media_type',
    label: t('wx_materials.media_type'),
    slots: {
      default: (data: any) => {
        const val = data.row.media_type
        const map: Record<string, { type: string; key: string }> = {
          image: { type: 'success', key: 'wx_materials.media_type_image' },
          voice: { type: 'warning', key: 'wx_materials.media_type_voice' },
          video: { type: 'danger', key: 'wx_materials.media_type_video' },
          thumb: { type: 'info', key: 'wx_materials.media_type_thumb' },
          news: { type: 'primary', key: 'wx_materials.media_type_news' }
        }
        const cfg = map[val] || { type: 'info', key: '' }
        return <ElTag type={cfg.type as any}>{t(cfg.key)}</ElTag>
      }
    }
  },
  {
    field: 'name',
    label: t('wx_materials.name'),
    width: 160
  },
  {
    field: 'media_id',
    label: t('wx_materials.media_id'),
    width: 160
  },
  {
    field: 'url',
    label: t('wx_materials.url'),
    width: 200
  },
  {
    field: 'is_permanent',
    label: t('wx_materials.is_permanent'),
    slots: {
      default: (data: any) => {
        const val = data.row.is_permanent
        return val === 1 ? (
          <ElTag type="success">{t('wx_materials.permanent_yes')}</ElTag>
        ) : (
          <ElTag type="warning">{t('wx_materials.permanent_no')}</ElTag>
        )
      }
    }
  },
  {
    field: 'sync_status',
    label: t('wx_materials.sync_status'),
    slots: {
      default: (data: any) => {
        const val = data.row.sync_status
        return val === 1 ? (
          <ElTag type="success">{t('wx_materials.sync_status_synced')}</ElTag>
        ) : (
          <ElTag type="danger">{t('wx_materials.sync_status_not_synced')}</ElTag>
        )
      }
    }
  },
  {
    field: 'created_at',
    label: t('wx_materials.created_at'),
    width: 160
  },
  {
    field: 'action',
    label: t('menuuser.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('usertable.edit')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('usertable.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

// ====== 搜索表单配置 ======
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'media_type',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.media_type_image'), value: 'image' },
        { label: t('wx_materials.media_type_voice'), value: 'voice' },
        { label: t('wx_materials.media_type_video'), value: 'video' },
        { label: t('wx_materials.media_type_thumb'), value: 'thumb' },
        { label: t('wx_materials.media_type_news'), value: 'news' }
      ]
    },
    label: t('wx_materials.media_type')
  },
  {
    field: 'name',
    component: 'Input',
    label: t('wx_materials.name')
  },
  {
    field: 'is_permanent',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.permanent_yes'), value: 1 },
        { label: t('wx_materials.permanent_no'), value: 0 }
      ]
    },
    label: t('wx_materials.is_permanent')
  },
  {
    field: 'sync_status',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.sync_status_synced'), value: 1 },
        { label: t('wx_materials.sync_status_not_synced'), value: 0 }
      ]
    },
    label: t('wx_materials.sync_status')
  }
])

const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

// ====== 增删改查 ======
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref()
const actionType = ref('')
const saveLoading = ref(false)

const writeRef = ref<ComponentRef<typeof Write>>()

const id = ref<string>()
const delData = async (row: any) => {
  id.value = row.id
  await delList(1).finally(() => {
    console.log('删除成功')
  })
}

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'usertable.edit' : 'usertable.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('usertable.add')
  actionType.value = 'add'
  const addRow = {
    account_id: null,
    media_type: 'image',
    media_id: null,
    name: null,
    url: null,
    local_path: null,
    file_size: null,
    content_type: null,
    width: null,
    height: null,
    duration: null,
    description: null,
    title: null,
    introduction: null,
    thumb_media_id: null,
    thumb_url: null,
    content_source_url: null,
    digest: null,
    author: null,
    content: null,
    news_items: null,
    is_permanent: 1,
    sync_status: 0
  }
  currentRow.value = addRow
  dialogVisible.value = true
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    if (actionType.value === 'edit') {
      const res = await EditWxMaterials(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddWxMaterials(formData)
      if (res) {
        getList()
      }
    }
    saveLoading.value = false
    dialogVisible.value = false
  }
}

// ====== 同步素材 ======
const handleSyncMaterials = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_materials.select_account_first'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('wx_materials.sync_materials_confirm'),
      t('wx_materials.sync_materials'),
      { type: 'warning' }
    )
    // 同步所有类型
    const types = ['image', 'voice', 'video', 'news']
    for (const mt of types) {
      await SyncMaterials({ account_id: selectedAccountId.value, media_type: mt })
    }
    ElMessage.success(t('wx_materials.sync_materials_success'))
    getList()
  } catch {
    /* 取消 */
  }
}

// ====== 素材计数 ======
const handleMaterialCount = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_materials.select_account_first'))
    return
  }
  try {
    const res = await MaterialCount({ account_id: selectedAccountId.value })
    if (res && res.data) {
      const d = res.data
      ElMessage.success(
        `${t('wx_materials.image_count')}: ${d.image_count}  ${t('wx_materials.voice_count')}: ${d.voice_count}  ${t('wx_materials.video_count')}: ${d.video_count}  ${t('wx_materials.news_count')}: ${d.news_count}`
      )
    }
  } catch {
    // ignore
  }
}

// ====== 删除远程素材 ======
const handleDeleteRemoteMedia = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_materials.select_account_first'))
    return
  }
  try {
    const { value: mediaId } = await ElMessageBox.prompt(
      t('wx_materials.input_media_id'),
      t('wx_materials.delete_remote_media'),
      {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        inputPattern: /\S+/,
        inputErrorMessage: t('wx_materials.media_id_required')
      }
    )
    await ElMessageBox.confirm(
      t('wx_materials.delete_remote_media_confirm'),
      t('wx_materials.delete_remote_media'),
      { type: 'error' }
    )
    const res = await DeleteRemoteMedia({ account_id: selectedAccountId.value, media_id: mediaId })
    if (res) ElMessage.success(t('wx_materials.delete_remote_media_success'))
  } catch {
    /* 取消 */
  }
}
</script>

<template>
  <ContentWrap>
    <!-- 公众号选择器 -->
    <div style="margin-bottom: 10px">
      <Form :schema="accountIdFormSchema" @register="accountFormRegister" />
    </div>

    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('usertable.add') }}</BaseButton>
      <BaseButton type="success" @click="handleSyncMaterials">{{
        t('wx_materials.sync_materials')
      }}</BaseButton>
      <BaseButton type="info" @click="handleMaterialCount">{{
        t('wx_materials.material_count')
      }}</BaseButton>
      <BaseButton type="danger" @click="handleDeleteRemoteMedia">{{
        t('wx_materials.delete_remote_media')
      }}</BaseButton>
    </div>

    <Table
      v-model:current-page="page_num"
      v-model:page-size="page_size"
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{ total }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('usertable.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('button.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
