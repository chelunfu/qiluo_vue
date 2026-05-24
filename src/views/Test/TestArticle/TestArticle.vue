<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import {
  GetTestCategoryList,
  AddTestCategory,
  EditTestCategory,
  DelTestCategory
} from '@/api/test/TestCategory'

import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { ElImage } from 'element-plus'
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const params: Record<string, any> = {
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    }
    const res = await GetTestCategoryList(params)
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await DelTestCategory(unref(id) as string)
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
    field: 'name',
    label: t('menuuser.name')
  },
  {
    field: 'description',
    label: t('menuuser.description')
  },
  {
    field: 'sort',
    label: t('menuuser.sort'),
    sortable: true
  },
  {
    field: 'status',
    label: t('menuuser.status'),
    width: 120
  },
  {
    field: 'cover',
    label: t('menuuser.cover'),
    width: 100,
    slots: {
      default: (data: any) =>
        data.row.cover ? (
          <ElImage
            style="width: 50px; height: 50px; border-radius: 4px"
            src={data.row.cover}
            fit="cover"
          />
        ) : null
    }
  },
  {
    field: 'is_active',
    label: t('menuuser.is_active'),
    width: 100,
    slots: {
      default: (data: any) =>
        data.row.is_active ? (
          <el-tag type="success">启用</el-tag>
        ) : (
          <el-tag type="info">禁用</el-tag>
        )
    }
  },
  {
    field: 'weight',
    label: t('menuuser.weight'),
    sortable: true
  },
  {
    field: 'view_count',
    label: t('menuuser.view_count')
  },
  {
    field: 'created_at',
    label: t('menuuser.created_at'),
    width: 180
  },
  {
    field: 'updated_at',
    label: t('menuuser.updated_at'),
    width: 180,
    sortable: true
  },
  {
    field: 'action',
    label: t('menuuser.action'),
    width: 300,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'detail')}>
              {t('button.detail')}
            </BaseButton>
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
  id.value = row.id
  await delList(1).finally(() => {
    console.log('删除成功')
  })
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('menuuser.name'),
    component: 'Input'
  },
  {
    field: 'description',
    label: t('menuuser.description'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menuuser.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: '选项一', value: 1 },
        { label: '选项二', value: 2 }
      ]
    }
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
  if (type === 'detail') {
    dialogTitle.value = t('dialog.detail')
  } else {
    dialogTitle.value = t(type === 'edit' ? 'dialog.edit' : 'dialog.detail')
  }
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('dialog.add')
  actionType.value = 'add'
  const addRow: Record<string, any> = {
    name: '',
    description: '',
    sort: 0,
    status: '',
    cover: '',
    is_active: false,
    weight: 0,
    view_count: 0
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
      const res = await EditTestCategory(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddTestCategory(formData)
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
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" width="60%">
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
