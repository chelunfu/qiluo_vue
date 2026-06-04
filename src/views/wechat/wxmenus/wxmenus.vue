<script setup lang="tsx">
import { reactive, ref, unref, onMounted } from 'vue'
import {
  GetWxMenusList,
  AddWxMenus,
  EditWxMenus,
  DelWxMenus,
  PullMenu,
  SyncMenu,
  DeleteRemoteMenu
} from '@/api/wechat/wxmenus_api'
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
    label: t('wx_menus.account_id'),
    component: 'Select',
    componentProps: {
      filterable: true,
      clearable: true,
      placeholder: t('wx_menus.account_id')
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

// 从表单获取当前选中的公众号ID（每次操作前实时获取）
const refreshAccountId = async () => {
  try {
    const data = await getAccountFormData()
    selectedAccountId.value = data?.account_id || ''
  } catch {
    // ignore
  }
}

onMounted(async () => {
  // 等表单渲染完后获取默认值
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
    const res = await GetWxMenusList(params)
    return {
      list: res.data && res.data.list ? res.data.list : [],
      total: res.data && res.data.total ? res.data.total : 0
    }
  },
  fetchDelApi: async () => {
    const res = await DelWxMenus(unref(id) as string)
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
    field: 'menu_name',
    label: t('wx_menus.menu_name')
  },
  {
    field: 'menu_type',
    label: t('wx_menus.menu_type'),
    slots: {
      default: (data: any) => {
        const val = data.row.menu_type
        const map: Record<string, { label: string; type: string }> = {
          click: { label: t('wx_menus.menu_type_click'), type: 'primary' },
          view: { label: t('wx_menus.menu_type_view'), type: 'success' },
          scancode_push: { label: t('wx_menus.menu_type_scancode_push'), type: 'warning' },
          scancode_waitmsg: { label: t('wx_menus.menu_type_scancode_waitmsg'), type: 'warning' },
          pic_sysphoto: { label: t('wx_menus.menu_type_pic_sysphoto'), type: 'info' },
          pic_photo_or_album: { label: t('wx_menus.menu_type_pic_photo_or_album'), type: 'info' },
          pic_weixin: { label: t('wx_menus.menu_type_pic_weixin'), type: 'info' },
          location_select: { label: t('wx_menus.menu_type_location_select'), type: 'info' },
          media_id: { label: t('wx_menus.menu_type_media_id'), type: 'danger' },
          article_id: { label: t('wx_menus.menu_type_article_id'), type: 'danger' },
          article_view_limited: {
            label: t('wx_menus.menu_type_article_view_limited'),
            type: 'danger'
          },
          miniprogram: { label: t('wx_menus.menu_type_miniprogram'), type: 'success' }
        }
        const item = map[val] || { label: val, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
  },
  {
    field: 'sort_order',
    label: t('wx_menus.sort_order')
  },
  {
    field: 'status',
    label: t('wx_menus.status'),
    slots: {
      default: (data: any) => {
        const val = data.row.status
        const map: Record<number, { label: string; type: string }> = {
          0: { label: t('wx_menus.status_disabled'), type: 'danger' },
          1: { label: t('wx_menus.status_enabled'), type: 'success' }
        }
        const item = map[val] || { label: val, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
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
    field: 'menu_name',
    component: 'Input',
    label: t('wx_menus.menu_name')
  },
  {
    field: 'menu_type',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_menus.menu_type_click'), value: 'click' },
        { label: t('wx_menus.menu_type_view'), value: 'view' },
        { label: t('wx_menus.menu_type_scancode_push'), value: 'scancode_push' },
        { label: t('wx_menus.menu_type_scancode_waitmsg'), value: 'scancode_waitmsg' },
        { label: t('wx_menus.menu_type_pic_sysphoto'), value: 'pic_sysphoto' },
        { label: t('wx_menus.menu_type_pic_photo_or_album'), value: 'pic_photo_or_album' },
        { label: t('wx_menus.menu_type_pic_weixin'), value: 'pic_weixin' },
        { label: t('wx_menus.menu_type_location_select'), value: 'location_select' },
        { label: t('wx_menus.menu_type_media_id'), value: 'media_id' },
        { label: t('wx_menus.menu_type_article_id'), value: 'article_id' },
        { label: t('wx_menus.menu_type_article_view_limited'), value: 'article_view_limited' },
        { label: t('wx_menus.menu_type_miniprogram'), value: 'miniprogram' }
      ]
    },
    label: t('wx_menus.menu_type')
  },
  {
    field: 'status',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_menus.status_disabled'), value: 0 },
        { label: t('wx_menus.status_enabled'), value: 1 }
      ]
    },
    label: t('wx_menus.status')
  }
])

// 搜索
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

// ====== 删除 ======
const id = ref<string>()
const delData = async (row: any) => {
  id.value = row.id
  await delList(1)
}

// ====== 弹窗 ======
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref()
const actionType = ref('')
const writeRef = ref<any>()
const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'usertable.edit' : 'usertable.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('usertable.add')
  actionType.value = 'add'
  currentRow.value = {
    account_id: selectedAccountId.value || null,
    parent_id: null,
    menu_name: '',
    menu_type: 'click',
    menu_key: null,
    url: null,
    media_id: null,
    appid: null,
    pagepath: null,
    article_id: null,
    sort_order: 0,
    status: 1
  }
  dialogVisible.value = true
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (!formData) return
  saveLoading.value = true
  try {
    if (actionType.value === 'edit') {
      await EditWxMenus(formData)
    } else {
      await AddWxMenus(formData)
    }
    getList()
  } finally {
    saveLoading.value = false
    dialogVisible.value = false
  }
}

// ====== 同步 / 发布 / 删除远程菜单 ======
const handleSyncMenu = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_menus.select_account_first'))
    return
  }
  try {
    await ElMessageBox.confirm(t('wx_menus.sync_menu_confirm'), t('wx_menus.sync_menu'), {
      type: 'warning'
    })
    const res = await SyncMenu({ account_id: selectedAccountId.value })
    if (res) ElMessage.success(res.data || t('wx_menus.sync_menu_success'))
  } catch {
    /* 取消 */
  }
}

const handlePullMenu = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_menus.select_account_first'))
    return
  }
  try {
    await ElMessageBox.confirm(t('wx_menus.pull_menu_confirm'), t('wx_menus.pull_menu'), {
      type: 'warning'
    })
    const res = await PullMenu({ account_id: selectedAccountId.value })
    if (res) ElMessage.success(res.data || t('wx_menus.pull_menu_success'))
  } catch {
    /* 取消 */
  }
}

const handleDeleteRemoteMenu = async () => {
  await refreshAccountId()
  if (!selectedAccountId.value) {
    ElMessage.warning(t('wx_menus.select_account_first'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('wx_menus.delete_remote_menu_confirm'),
      t('wx_menus.delete_remote_menu'),
      { type: 'error' }
    )
    const res = await DeleteRemoteMenu({ account_id: selectedAccountId.value })
    if (res) ElMessage.success(res.data || t('wx_menus.delete_remote_menu_success'))
  } catch {
    /* 取消 */
  }
}
</script>

<template>
  <ContentWrap>
    <!-- 公众号选择器（使用与 Write.vue 相同的 Form + optionApi 方式） -->
    <div style="margin-bottom: 10px">
      <Form :schema="accountIdFormSchema" @register="accountFormRegister" />
    </div>

    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('usertable.add') }}</BaseButton>
      <BaseButton type="success" @click="handleSyncMenu">{{ t('wx_menus.sync_menu') }}</BaseButton>
      <BaseButton type="warning" @click="handlePullMenu">{{ t('wx_menus.pull_menu') }}</BaseButton>
      <BaseButton type="danger" @click="handleDeleteRemoteMenu">{{
        t('wx_menus.delete_remote_menu')
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
