<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import {
  GetWxMessagesList,
  AddWxMessages,
  EditWxMessages,
  DelWxMessages
} from '@/api/wechat/wxmessages_api'
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
    const res = await GetWxMessagesList({
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
    const res = await DelWxMessages(unref(id) as string)
    return !!res
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { getList, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'id',
    label: t('wx_messages.id')
  },
  {
    field: 'openid',
    label: t('wx_messages.openid')
  },
  {
    field: 'msg_type',
    label: t('wx_messages.msg_type')
  },
  {
    field: 'direction',
    label: t('wx_messages.direction')
  },
  {
    field: 'content',
    label: t('wx_messages.content')
  },
  {
    field: 'pic_url',
    label: t('wx_messages.pic_url')
  },
  {
    field: 'voice_format',
    label: t('wx_messages.voice_format')
  },
  {
    field: 'recognition',
    label: t('wx_messages.recognition')
  },
  {
    field: 'msg_title',
    label: t('wx_messages.msg_title')
  },
  {
    field: 'msg_description',
    label: t('wx_messages.msg_description')
  },
  {
    field: 'link_url',
    label: t('wx_messages.link_url')
  },
  {
    field: 'event_type',
    label: t('wx_messages.event_type')
  },
  {
    field: 'event_key',
    label: t('wx_messages.event_key')
  },
  {
    field: 'is_auto_reply',
    label: t('wx_messages.is_auto_reply')
  },

  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
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
    field: 'id',
    component: 'Input',
    label: t('wx_messages.id')
  },
  {
    field: 'openid',
    component: 'Input',
    label: t('wx_messages.openid')
  },
  {
    field: 'msg_type',
    component: 'Input',
    label: t('wx_messages.msg_type')
  },
  {
    field: 'direction',
    component: 'Input',
    label: t('wx_messages.direction')
  },
  {
    field: 'content',
    component: 'Input',
    label: t('wx_messages.content')
  },
  {
    field: 'pic_url',
    component: 'Input',
    label: t('wx_messages.pic_url')
  },
  {
    field: 'voice_format',
    component: 'Input',
    label: t('wx_messages.voice_format')
  },
  {
    field: 'recognition',
    component: 'Input',
    label: t('wx_messages.recognition')
  },
  {
    field: 'msg_title',
    component: 'Input',
    label: t('wx_messages.msg_title')
  },
  {
    field: 'msg_description',
    component: 'Input',
    label: t('wx_messages.msg_description')
  },
  {
    field: 'link_url',
    component: 'Input',
    label: t('wx_messages.link_url')
  },
  {
    field: 'event_type',
    component: 'Input',
    label: t('wx_messages.event_type')
  },
  {
    field: 'event_key',
    component: 'Input',
    label: t('wx_messages.event_key')
  },
  {
    field: 'is_auto_reply',
    component: 'Input',
    label: t('wx_messages.is_auto_reply')
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
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'add'
  const addRow = {
    id: 0,
    openid: '',
    msg_type: '',
    direction: '',
    content: null,
    pic_url: null,
    voice_format: null,
    recognition: null,
    msg_title: null,
    msg_description: null,
    link_url: null,
    event_type: null,
    event_key: null,
    is_auto_reply: null
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
      const res = await EditWxMessages(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddWxMessages(formData)
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
      <BaseButton type="primary" @click="AddAction">{ t('exampleDemo.add') }</BaseButton>
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
        { t('exampleDemo.save') }
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{ t('dialogDemo.close') }</BaseButton>
    </template>
  </Dialog>
</template>
