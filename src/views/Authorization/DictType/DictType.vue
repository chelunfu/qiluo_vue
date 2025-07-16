<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetDictTypeList, AddDictType, EditDictType, DelDictType } from '@/api/dicttype'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElLink } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
const { push } = useRouter()
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetDictTypeList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    console.log(unref(id))
    const res = await DelDictType(unref(id) as string)
    return !!res
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { getList, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'dict_name',
    label: t('dict_data.dict_name')
  },
  {
    field: 'dict_type',
    label: t('dict_data.dict_type'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElLink type="primary" onClick={() => godata(data.row)}>
              {data.row.dict_type}
            </ElLink>
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
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('button.edit')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('button.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const id = ref<string>()
const delData = async (row: any) => {
  id.value = row.dict_id
  await delList(1).finally(() => {
    console.log('删除成功')
  })
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'dict_name',
    label: t('dict_data.dict_name'),
    component: 'Input'
  },
  {
    field: 'dict_type',
    label: t('dict_data.dict_type'),
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

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'dialog.edit' : 'dialog.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const godata = (row: any) => {
  push({
    path: '/authorization/dictdata',
    query: { dict_type: row.dict_type },
    state: {
      dicttype: {
        dict_type_id: row.dict_id
      }
    }
  })
}

const AddAction = () => {
  dialogTitle.value = t('dialog.add')

  actionType.value = 'add'
  const addRow = {
    dict_name: '',
    dict_type: '',
    order: 1,
    remark: ''
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
      const res = await EditDictType(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddDictType(formData)
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
      <BaseButton type="primary" @click="AddAction">{{ t('button.add') }}</BaseButton>
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
