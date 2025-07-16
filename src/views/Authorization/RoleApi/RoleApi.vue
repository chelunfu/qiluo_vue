<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetRoleApiList, add_many_role_api_transfer } from '@/api/roleapi'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { useRouter, useRoute } from 'vue-router'
import { FormSchema } from '@/components/Form'
import { Search } from '@/components/Search'
const { go } = useRouter()
const { query } = useRoute()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetRoleApiList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      role_id: query.role_id,
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    console.log(unref(id))
    return false
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
    field: 'api',
    label: t('apipermission.api')
  },
  {
    field: 'apiname',
    label: t('apipermission.apiname')
  },
  {
    field: 'method',
    label: t('apipermission.method'),
    width: 120
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
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('button.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const id = ref<string>()
const delData = async (row: any) => {
  id.value = row.dict_code
  await delList(1).finally(() => {
    console.log('删除成功')
  })
}

const AddAction = () => {
  dialogTitle.value = t('dialog.add')

  actionType.value = 'add'
  const addRow = {
    role_id: query.role_id
  }
  currentRow.value = addRow
  dialogVisible.value = true
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    const res = await add_many_role_api_transfer(formData)
    if (res) {
      getList()
    }
    saveLoading.value = false
    dialogVisible.value = false
  }
}
const searchParams = ref({})
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'api',
    label: t('apipermission.api'),
    component: 'Input'
  },
  {
    field: 'apiname',
    label: t('apipermission.apiname'),
    component: 'Input'
  }
])

const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('button.add') }}</BaseButton>
      <BaseButton type="danger" @click="go(-1)" plain>{{ t('button.back') }}</BaseButton>
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px">
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
      <BaseButton @click="dialogVisible = false">{{ t('dialog.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
