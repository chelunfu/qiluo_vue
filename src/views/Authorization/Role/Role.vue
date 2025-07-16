<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetRoleList, PutRoleEditor, PostRoleAdd, RoleApi } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag, ElLink } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
import { data_scope_values } from '@/api/role/types'
const { push } = useRouter()
const { t } = useI18n()
import { hasPermi } from '@/components/Permission'
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetRoleList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'role_name',
    label: t('role.roleName')
  },
  {
    field: 'role_key',
    label: t('role.roleName'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElLink type="primary" onClick={() => godata(data.row)}>
              {data.row.role_key}
            </ElLink>
          </>
        )
      }
    }
  },
  {
    field: 'data_scope',
    label: t('role.dataScope'),
    slots: {
      default: (data: any) => {
        const data_scope = data.row.data_scope
        return (
          <>
            <ElTag effect="plain">
              {data_scope_values.find((item: any) => item.value === data_scope)?.label}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'order',
    label: t('role.order')
  },
  {
    field: 'status',
    label: t('menu.status'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        const status = data.row.status
        console.log()
        return (
          <>
            <ElTag type={status === '1' ? 'danger' : 'success'}>
              {status === '0' ? t('menuuser.enable') : t('menuuser.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'remark',
    label: t('menuuser.remark')
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
            <BaseButton
              v-show={hasPermi(RoleApi.edit)}
              type="primary"
              onClick={() => action(row, 'edit')}
            >
              {t('button.edit')}
            </BaseButton>
            <BaseButton v-show={hasPermi(RoleApi.del)} type="danger">
              {t('button.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'role_name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'role_key',
    label: t('role.rolekey'),
    component: 'Input'
  }
])

const godata = (row: any) => {
  push(`/authorization/roleapi?role_id=${row.role_id}`)
}
const searchParams = ref({})
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
  dialogTitle.value = t(type === 'edit' ? 'dialog.edit' : 'dialog.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('dialog.add')

  actionType.value = 'add'
  currentRow.value = undefined
  dialogVisible.value = true
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    if (actionType.value === 'edit') {
      const res = await PutRoleEditor(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await PostRoleAdd(formData)
      if (res) {
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
      <BaseButton v-if="hasPermi(RoleApi.add)" type="primary" @click="AddAction">{{
        t('button.add')
      }}</BaseButton>
    </div>
    <Table
      v-model:current-page="page_num"
      v-model:page-size="page_size"
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
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
        {{ t('button.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('button.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
