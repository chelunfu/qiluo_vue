<script setup lang="tsx">
import { reactive, ref, unref, onBeforeMount } from 'vue'
import { GetDictDataList, EditDictData, AddDictData, DelDictData } from '@/api/dictdata'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { useRouter, useRoute } from 'vue-router'
const { go } = useRouter()
const { query } = useRoute()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetDictDataList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      dict_type_id: unref(dict_type_id)
    })
    const list = res.data.list
    const newlist = list.map((item) => {
      const dict_type = query.dict_type
      return {
        ...item,
        dict_type
      }
    })
    return {
      list: newlist || [],
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await DelDictData(unref(id) as string)
    return !!res
  }
})
const dict_type_id = ref<number>()
const { dataList, loading, total, page_size, page_num } = tableState
const { getList, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'dict_label',
    label: t('dict_data.dict_label')
  },
  {
    field: 'dict_value',
    label: t('dict_data.dict_value')
  },
  {
    field: 'dict_type',
    label: t('dict_data.dict_type')
  },
  {
    field: 'dict_sort',
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
const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'dialog.edit' : 'dialog.detail')
  actionType.value = type
  const editRow = row
  editRow.dict_type = query.dict_type

  editRow.dict_type_id = unref(dict_type_id)
  currentRow.value = editRow
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('dialog.add')

  actionType.value = 'add'
  const addRow = {
    dict_type: query.dict_type,

    dict_type_id: unref(dict_type_id),
    dict_label: '',
    dict_value: '',
    dict_sort: 0,
    remark: ''
  }
  currentRow.value = addRow
  dialogVisible.value = true
}

// const Back = () => {
//   push(`/authorization/dict_type`)
// }

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    //const roleEdit: RoleEditReq = {}
    if (actionType.value === 'edit') {
      const res = await EditDictData(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddDictData(formData)
      if (res) {
        getList()
      }
    }
    saveLoading.value = false
    dialogVisible.value = false
  }
}
onBeforeMount(() => {
  const dicttype = history.state.dicttype
  dict_type_id.value = dicttype.dict_type_id
})
</script>

<template>
  <ContentWrap>
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('button.add') }}</BaseButton>
      <BaseButton type="danger" @click="go(-1)" plain>{{ t('button.back') }}</BaseButton>
    </div>
    <Table
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
