<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetWxUsersList, AddWxUsers, EditWxUsers, DelWxUsers } from '@/api/wechat/wxusers_api'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElLink, ElTag } from 'element-plus'
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
    const res = await GetWxUsersList({
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
    const res = await DelWxUsers(unref(id) as string)
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
    field: 'id',
    label: t('wx_users.id')
  },
  {
    field: 'openid',
    label: t('wx_users.openid')
  },
  {
    field: 'unionid',
    label: t('wx_users.unionid')
  },
  {
    field: 'nickname',
    label: t('wx_users.nickname')
  },
  {
    field: 'sex',
    label: t('wx_users.sex'),
    slots: {
      default: (data: any) => {
        const sexMap: Record<number, { label: string; type: string }> = {
          0: { label: t('wx_users.sex_unknown'), type: 'info' },
          1: { label: t('wx_users.sex_male'), type: 'primary' },
          2: { label: t('wx_users.sex_female'), type: 'danger' }
        }
        const info = sexMap[data.row.sex] || { label: '-', type: 'info' }
        return <ElTag type={info.type}>{info.label}</ElTag>
      }
    }
  },
  {
    field: 'city',
    label: t('wx_users.city')
  },
  {
    field: 'country',
    label: t('wx_users.country')
  },
  {
    field: 'province',
    label: t('wx_users.province')
  },
  {
    field: 'language',
    label: t('wx_users.language')
  },
  {
    field: 'headimgurl',
    label: t('wx_users.headimgurl')
  },
  {
    field: 'subscribe_time',
    label: t('wx_users.subscribe_time')
  },
  {
    field: 'unsubscribe_time',
    label: t('wx_users.unsubscribe_time')
  },
  {
    field: 'subscribe_status',
    label: t('wx_users.subscribe_status'),
    slots: {
      default: (data: any) => {
        const statusMap: Record<number, { label: string; type: string }> = {
          0: { label: t('wx_users.subscribe_status_no'), type: 'danger' },
          1: { label: t('wx_users.subscribe_status_yes'), type: 'success' }
        }
        const info = statusMap[data.row.subscribe_status] || { label: '-', type: 'info' }
        return <ElTag type={info.type}>{info.label}</ElTag>
      }
    }
  },
  {
    field: 'remark',
    label: t('wx_users.remark')
  },
  {
    field: 'subscribe_scene',
    label: t('wx_users.subscribe_scene')
  },
  {
    field: 'qr_scene',
    label: t('wx_users.qr_scene')
  },
  {
    field: 'qr_scene_str',
    label: t('wx_users.qr_scene_str')
  },
  {
    field: 'last_interact_time',
    label: t('wx_users.last_interact_time')
  },
  {
    field: 'message_count',
    label: t('wx_users.message_count')
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
              {t('usertable.edit')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('usertable.del')}
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
    field: 'nickname',
    component: 'Input',
    label: t('wx_users.nickname')
  },
  {
    field: 'sex',
    component: 'Select',
    label: t('wx_users.sex'),
    componentProps: {
      options: [
        { label: t('wx_users.sex_unknown'), value: 0 },
        { label: t('wx_users.sex_male'), value: 1 },
        { label: t('wx_users.sex_female'), value: 2 }
      ]
    }
  },
  {
    field: 'subscribe_status',
    component: 'Select',
    label: t('wx_users.subscribe_status'),
    componentProps: {
      options: [
        { label: t('wx_users.subscribe_status_no'), value: 0 },
        { label: t('wx_users.subscribe_status_yes'), value: 1 }
      ]
    }
  },
  {
    field: 'openid',
    component: 'Input',
    label: t('wx_users.openid')
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
  dialogTitle.value = t(type === 'edit' ? 'usertable.edit' : 'usertable.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('usertable.add')
  actionType.value = 'add'
  const addRow = {
    id: 0,
    openid: '',
    unionid: null,
    nickname: null,
    sex: null,
    city: null,
    country: null,
    province: null,
    language: null,
    headimgurl: null,
    subscribe_time: null,
    unsubscribe_time: null,
    subscribe_status: null,
    remark: null,
    subscribe_scene: null,
    qr_scene: null,
    qr_scene_str: null,
    last_interact_time: null,
    message_count: null
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
      const res = await EditWxUsers(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddWxUsers(formData)
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
        {{ t('usertable.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('button.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
