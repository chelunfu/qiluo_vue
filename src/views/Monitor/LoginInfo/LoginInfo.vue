<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetLoginInfoList } from '@/api/logininfo'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetLoginInfoList({
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
const { getList, refresh } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'user_name',
    label: t('role.roleName')
  },
  {
    field: 'device_type',
    label: t('login_info.device_type')
  },
  {
    field: 'ipaddr',
    label: t('login_info.ip')
  },
  {
    field: 'status',
    label: t('login_info.loginstatus'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        const status = data.row.status

        return (
          <>
            <ElTag type={status === '1' ? 'danger' : 'success'}>
              {status === '0' ? t('login_info.success') : t('login_info.fail')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'login_location',
    label: t('login_info.login_location')
  },
  {
    field: 'browser',
    label: t('login_info.browser')
  },
  {
    field: 'os',
    label: t('login_info.os')
  },
  {
    field: 'msg',
    label: t('login_info.login_msg')
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'user_name',
    label: t('role.roleName'),
    component: 'Input'
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" :showReset="false" />

    <Table
      v-model:current-page="page_num"
      v-model:page-size="page_size"
      showAction
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
      @refresh="refresh"
    />
  </ContentWrap>
</template>
