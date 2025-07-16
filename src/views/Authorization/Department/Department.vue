<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { FormSchema } from '@/components/Form'
import { GetDeptList, PutDeptEdit, PostDeptAdd, DelDept, ApiDept } from '@/api/department'

import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { BaseButton } from '@/components/Button'
import { hasPermi } from '@/components/Permission'
const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { page_num, page_size } = tableState
    const res = await GetDeptList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await DelDept(unref(ids))
    return !!res
  }
})
const { loading, dataList, total, page_num, page_size } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('department.index'),
    type: 'index'
  },
  {
    field: 'dept_name',
    label: t('menuuser.departmentName'),
    slots: {
      default: (data: any) => {
        return <>{data.row.dept_name}</>
      }
    }
  },
  {
    field: 'status',
    label: t('menuuser.status'),

    slots: {
      default: (data: any) => {
        const status = data.row.status
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
    width: '260px',
    label: t('department.action'),

    slots: {
      default: (data: any) => {
        return (
          <>
            <BaseButton type="primary" onClick={() => action(data.row, 'edit')}>
              {t('button.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(data.row, 'detail')}>
              {t('button.detail')}
            </BaseButton>

            <BaseButton
              v-show={hasPermi(ApiDept.DelDept)}
              type="danger"
              onClick={() => delData(data.row)}
            >
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
    field: 'dept_name',
    label: t('menuuser.departmentName'),
    component: 'Input'
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('dialog.add')
  actionType.value = 'add'
  currentRow.value = null
  dialogVisible.value = true
}

const delLoading = ref(false)

const delData = async (row: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.dept_id]
    : elTableExpose?.getSelectionRows().map((v: any) => v.dept_id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

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
    saveLoading.value = true

    if (actionType.value === 'edit') {
      const res = await PutDeptEdit(formData)
      if (res) {
        getList()
      }
    } else if (actionType.value === 'add') {
      const res = await PostDeptAdd(formData)
      if (res) {
        getList()
      }
    }
    saveLoading.value = false
    dialogVisible.value = false
    page_num.value = 1
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <BaseButton v-if="hasPermi(ApiDept.DeptAdd)" type="primary" @click="AddAction">{{
        t('button.add')
      }}</BaseButton>
      <BaseButton
        v-if="hasPermi(ApiDept.DelDept)"
        :loading="delLoading"
        type="danger"
        @click="delData(null)"
      >
        {{ t('button.del') }}
      </BaseButton>
    </div>

    <Table
      v-model:pageSize="page_size"
      v-model:currentPage="page_num"
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      row-key="dept_id"
      :pagination="{
        total: total
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
      <BaseButton @click="dialogVisible = false">{{ t('dialog.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
