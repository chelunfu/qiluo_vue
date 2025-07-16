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
    console.log(unref(id))
    const res = await DelWxAutoReplies(unref(id) as string)
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
    label: t('wx_auto_replies.id')
  },
  {
    field: 'reply_type',
    label: t('wx_auto_replies.reply_type')
  },
  {
    field: 'keyword',
    label: t('wx_auto_replies.keyword')
  },
  {
    field: 'match_type',
    label: t('wx_auto_replies.match_type')
  },
  {
    field: 'message_type',
    label: t('wx_auto_replies.message_type')
  },
  {
    field: 'content',
    label: t('wx_auto_replies.content')
  },
  {
    field: 'title',
    label: t('wx_auto_replies.title')
  },
  {
    field: 'description',
    label: t('wx_auto_replies.description')
  },
  {
    field: 'pic_url',
    label: t('wx_auto_replies.pic_url')
  },
  {
    field: 'url',
    label: t('wx_auto_replies.url')
  },
  {
    field: 'music_url',
    label: t('wx_auto_replies.music_url')
  },
  {
    field: 'hq_music_url',
    label: t('wx_auto_replies.hq_music_url')
  },
  {
    field: 'status',
    label: t('wx_auto_replies.status')
  },
  {
    field: 'priority',
    label: t('wx_auto_replies.priority')
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
    label: t('wx_auto_replies.id')
  },
  {
    field: 'reply_type',
    component: 'Input',
    label: t('wx_auto_replies.reply_type')
  },
  {
    field: 'keyword',
    component: 'Input',
    label: t('wx_auto_replies.keyword')
  },
  {
    field: 'match_type',
    component: 'Input',
    label: t('wx_auto_replies.match_type')
  },
  {
    field: 'message_type',
    component: 'Input',
    label: t('wx_auto_replies.message_type')
  },
  {
    field: 'content',
    component: 'Input',
    label: t('wx_auto_replies.content')
  },
  {
    field: 'title',
    component: 'Input',
    label: t('wx_auto_replies.title')
  },
  {
    field: 'description',
    component: 'Input',
    label: t('wx_auto_replies.description')
  },
  {
    field: 'pic_url',
    component: 'Input',
    label: t('wx_auto_replies.pic_url')
  },
  {
    field: 'url',
    component: 'Input',
    label: t('wx_auto_replies.url')
  },
  {
    field: 'music_url',
    component: 'Input',
    label: t('wx_auto_replies.music_url')
  },
  {
    field: 'hq_music_url',
    component: 'Input',
    label: t('wx_auto_replies.hq_music_url')
  },
  {
    field: 'status',
    component: 'Input',
    label: t('wx_auto_replies.status')
  },
  {
    field: 'priority',
    component: 'Input',
    label: t('wx_auto_replies.priority')
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
    reply_type: '',
    keyword: null,
    match_type: null,
    message_type: '',
    content: null,
    title: null,
    description: null,
    pic_url: null,
    url: null,
    music_url: null,
    hq_music_url: null,
    status: null,
    priority: null
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
