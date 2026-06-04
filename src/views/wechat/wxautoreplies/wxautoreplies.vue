<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import {
  GetWxAutoRepliesList,
  AddWxAutoReplies,
  EditWxAutoReplies,
  DelWxAutoReplies
} from '@/api/wechat/wxautoreplies_api'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { ElTag } from 'element-plus'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetWxAutoRepliesList({
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
    const res = await DelWxAutoReplies(unref(id) as string)
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
    field: 'keyword',
    label: t('wx_auto_replies.keyword')
  },
  {
    field: 'reply_type',
    label: t('wx_auto_replies.reply_type'),
    slots: {
      default: (data: any) => {
        const row = data.row
        const typeMap: Record<number, { label: string; type: string }> = {
          1: { label: t('wx_auto_replies.reply_type_subscribe'), type: 'warning' },
          2: { label: t('wx_auto_replies.reply_type_keyword'), type: 'primary' },
          3: { label: t('wx_auto_replies.reply_type_default'), type: 'info' }
        }
        const item = typeMap[row.reply_type] || { label: row.reply_type, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
  },
  {
    field: 'match_type',
    label: t('wx_auto_replies.match_type'),
    slots: {
      default: (data: any) => {
        const row = data.row
        const typeMap: Record<number, { label: string; type: string }> = {
          1: { label: t('wx_auto_replies.match_type_full'), type: 'success' },
          2: { label: t('wx_auto_replies.match_type_partial'), type: 'warning' },
          3: { label: t('wx_auto_replies.match_type_regex'), type: 'danger' }
        }
        const item = typeMap[row.match_type] || { label: row.match_type, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
  },
  {
    field: 'message_type',
    label: t('wx_auto_replies.message_type'),
    slots: {
      default: (data: any) => {
        const row = data.row
        const typeMap: Record<string, { label: string; type: string }> = {
          text: { label: t('wx_auto_replies.message_type_text'), type: 'text' as any },
          image: { label: t('wx_auto_replies.message_type_image'), type: 'success' },
          voice: { label: t('wx_auto_replies.message_type_voice'), type: 'warning' },
          music: { label: t('wx_auto_replies.message_type_music'), type: 'danger' },
          news: { label: t('wx_auto_replies.message_type_news'), type: 'primary' },
          video: { label: t('wx_auto_replies.message_type_video'), type: 'info' }
        }
        const item = typeMap[row.message_type] || { label: row.message_type, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
  },
  {
    field: 'content',
    label: t('wx_auto_replies.content')
  },
  {
    field: 'status',
    label: t('wx_auto_replies.status'),
    slots: {
      default: (data: any) => {
        const row = data.row
        const typeMap: Record<number, { label: string; type: string }> = {
          0: { label: t('wx_auto_replies.status_disabled'), type: 'danger' },
          1: { label: t('wx_auto_replies.status_enabled'), type: 'success' }
        }
        const item = typeMap[row.status] || { label: row.status, type: 'info' }
        return <ElTag type={item.type}>{item.label}</ElTag>
      }
    }
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
    field: 'keyword',
    component: 'Input',
    label: t('wx_auto_replies.keyword')
  },
  {
    field: 'reply_type',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_auto_replies.reply_type_subscribe'), value: 1 },
        { label: t('wx_auto_replies.reply_type_keyword'), value: 2 },
        { label: t('wx_auto_replies.reply_type_default'), value: 3 }
      ]
    },
    label: t('wx_auto_replies.reply_type')
  },
  {
    field: 'message_type',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_auto_replies.message_type_text'), value: 'text' },
        { label: t('wx_auto_replies.message_type_image'), value: 'image' },
        { label: t('wx_auto_replies.message_type_voice'), value: 'voice' },
        { label: t('wx_auto_replies.message_type_music'), value: 'music' },
        { label: t('wx_auto_replies.message_type_news'), value: 'news' },
        { label: t('wx_auto_replies.message_type_video'), value: 'video' }
      ]
    },
    label: t('wx_auto_replies.message_type')
  },
  {
    field: 'status',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_auto_replies.status_disabled'), value: 0 },
        { label: t('wx_auto_replies.status_enabled'), value: 1 }
      ]
    },
    label: t('wx_auto_replies.status')
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
    account_id: null,
    reply_type: 2,
    keyword: null,
    match_type: 1,
    message_type: 'text',
    content: null,
    media_id: null,
    title: null,
    description: null,
    pic_url: null,
    url: null,
    music_url: null,
    hq_music_url: null,
    thumb_media_id: null,
    status: 1,
    priority: 0
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
      const res = await EditWxAutoReplies(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddWxAutoReplies(formData)
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
      <BaseButton type="primary" @click="AddAction">{{ t('usertable.add') }}</BaseButton>
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
