<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { ApiPermissionList, EditApiPermission } from '@/api/apipermission'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Detail from './components/Detail.vue'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { DictType, useDicts } from '@/api/dictdata'
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await ApiPermissionList({
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
    field: 'api',
    label: t('apipermission.api')
  },
  {
    field: 'method',
    label: t('apipermission.method')
  },
  {
    field: 'apiname',
    label: t('apipermission.apiname')
  },
  {
    field: 'logcache',
    label: t('apipermission.logcache'),
    slots: {
      default: (data: any) => {
        const dict_value = data.row.logcache
        let logvalue = ''
        const foundItem: any = dicts.value.find((item: any) => item.dict_value === dict_value)
        if (foundItem) {
          logvalue = foundItem.dict_label
        }
        return <span>{logvalue}</span>
      }
    }
  },
  {
    field: 'sort',
    label: t('role.order')
  },
  {
    field: 'remark',
    label: t('menuuser.remark')
  },

  {
    field: 'action',
    label: t('menuuser.action'),
    width: 180,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="success" onClick={() => action(row, 'edit')}>
              {t('button.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('button.detail')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'api',
    label: t('apipermission.api'),
    component: 'Input'
  },
  {
    field: 'method',
    label: t('apipermission.method'),
    component: 'Input'
  },
  {
    field: 'apiname',
    label: t('apipermission.apiname'),
    component: 'Input'
  }
])

const dicts = useDicts(DictType.SysLogcache)
const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'dialog.edit' : 'dialog.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}
const writeRef = ref<ComponentRef<typeof Write>>()
const saveLoading = ref(false)
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    const res = await EditApiPermission(formData)
    if (res) {
      getList()
    }
  }
  saveLoading.value = false
  dialogVisible.value = false
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
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
      <BaseButton @click="dialogVisible = false">{{ t('button.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
