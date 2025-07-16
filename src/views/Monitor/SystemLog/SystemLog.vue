<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetOperationLogList } from '@/api/operation_log'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetOperationLogList({
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
    field: 'api_name',
    label: t('systemlog.api_name')
  },
  {
    field: 'oper_name',
    label: t('systemlog.oper_name')
  },
  {
    field: 'request_method',
    label: t('systemlog.request_method')
  },
  {
    field: 'oper_url',
    label: t('systemlog.oper_url')
  },
  {
    field: 'oper_ip',
    label: t('systemlog.oper_ip')
  },
  {
    field: 'oper_location',
    label: t('systemlog.oper_location')
  },

  {
    field: 'cost_time',
    label: t('systemlog.cost_time')
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
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'oper_name',
    label: t('role.roleName'),
    component: 'Input'
  }
])

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
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
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
    <Detail :current-row="currentRow" />

    <template #footer>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
