<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetMenuList, PutMenuEditor, PostMenuAdd, DelMenu, ApiMenu } from '@/api/menu'
import { MenuAdd } from '@/api/menu/type'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElMessage, ElTag, ElTooltip } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { hasPermi } from '@/components/Permission'
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetMenuList()
    return {
      list: res.data || []
    }
  },
  fetchDelApi: async () => {
    const res = await DelMenu(unref(id))
    return !!res
  }
})

const { dataList, loading } = tableState
const { getList, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'title',
    label: t('menu.menuName'),
    slots: {
      default: (data: any) => {
        const title = data.row.title
        return <>{title}</>
      }
    }
  },
  {
    field: 'icon',
    label: t('menu.icon'),
    slots: {
      default: (data: any) => {
        const icon = data.row.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data: any) => {
        const component = data.row.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === '0' ? 'success' : 'danger'}>
              {data.row.status === '0' ? t('menuuser.enable') : t('menuuser.disable')}
            </ElTag>
          </>
        )
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
            <ElTooltip
              v-show={hasPermi(ApiMenu.edit)}
              content={t('button.edit')}
              placement="bottom"
            >
              <BaseButton size="small" type="primary" onClick={() => action(row, 'edit')}>
                <Icon icon="vi-ant-design:edit-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip content={t('button.detail')} placement="bottom">
              <BaseButton size="small" type="success" onClick={() => action(row, 'detail')}>
                <Icon icon="vi-ant-design:file-text-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip v-show={hasPermi(ApiMenu.add)} content={t('button.add')} placement="bottom">
              <BaseButton size="small" type="warning" onClick={() => AddAction(row)}>
                <Icon icon="vi-ant-design:file-add-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip v-show={hasPermi(ApiMenu.del)} content={t('button.del')} placement="bottom">
              <BaseButton size="small" type="danger" onClick={() => delData(row)}>
                <Icon icon="vi-ant-design:delete-filled" />
              </BaseButton>
            </ElTooltip>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: t('menu.menuName'),
    component: 'Input'
  }
])

const searchParams = ref({})

const id = ref<string>('0')
const delLoading = ref(false)
const delData = async (row: any) => {
  id.value = row.id
  delLoading.value = true
  await delList(row.id).finally(() => {
    delLoading.value = false
  })

  console.log(row)
}
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'button.edit' : 'button.detail')
  actionType.value = type
  if (type === 'edit') {
    currentRow.value = row
  } else if (type === 'detail') {
    currentRow.value = row
  }

  dialogVisible.value = true
}

const AddAction = (row: any) => {
  dialogTitle.value = t('button.add')
  actionType.value = 'add'
  const menuAddRow: MenuAdd = {
    title: '',
    icon: '',
    hidden: false,
    alwaysShow: false,
    noCache: false,
    breadcrumb: false,
    affix: false,
    activeMenu: false,
    noTagsView: false,
    canTo: false,
    api: '',
    method: '',

    component: '#',
    path: '',
    status: '0',
    pid: '0',
    redirect: null,
    name: '',
    menu_type: 'M',
    remark: null,
    order: 1
  }
  if (row) {
    if (row.menu_type === 'F') {
      ElMessage.warning(t('warninginfo.noadd'))
      return
    } else {
      menuAddRow.menu_type = 'C'
      menuAddRow.pid = row.id
    }
  }
  currentRow.value = menuAddRow
  dialogVisible.value = true
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    if (actionType.value === 'add') {
      const menuAdd = await PostMenuAdd(formData)

      if (menuAdd) {
        getList()
      }
    } else if (actionType.value === 'edit') {
      const menuEditor = await PutMenuEditor(formData)
      if (menuEditor) {
        getList()
      }
    }

    saveLoading.value = false
    dialogVisible.value = false
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton v-if="hasPermi(ApiMenu.add)" type="primary" @click="AddAction(undefined)">{{
        t('button.add')
      }}</BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      node-key="id"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('button.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialog.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
