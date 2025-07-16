<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetJobLogList, DelJobLog } from '@/api/joblog'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'
import { useRouter, useRoute } from 'vue-router'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
const { go } = useRouter()
const { query } = useRoute()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetJobLogList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      job_id: query.job_id
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    console.log(unref(id))
    const res = await DelJobLog(unref(id) as string)
    return !!res
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'run_count',
    label: t('job.run_count'),
    width: 120
  },
  {
    field: 'job_message',
    label: t('job.job_message')
  },
  {
    field: 'status',
    label: t('job.status'),
    width: 100
  },
  {
    field: 'action',
    label: t('menuuser.action'),
    width: 100,
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

const id = ref<string>()
const delData = async (row: any) => {
  id.value = row.dict_code
  await delList(1).finally(() => {
    console.log('删除成功')
  })
}

const data = ref({})
const setdata = () => {
  const jobdata = history.state.jobdata
  data.value = jobdata
}
setdata()
const schema = reactive<DescriptionsSchema[]>([
  {
    field: 'task_type',
    label: t('job.task_type')
  },
  {
    field: 'job_name',
    label: t('job.job_name')
  },
  {
    field: 'job_group',
    label: t('job.job_group')
  },
  {
    field: 'job_params',
    label: t('job.job_params')
  }
])
</script>

<template>
  <Descriptions
    :title="t('joblog.descriptions')"
    :message="t('joblog.joblog')"
    :data="data"
    :schema="schema"
  />
  <ContentWrap>
    <div class="mb-10px">
      <BaseButton type="danger" @click="go(-1)" plain>{{ t('common.back') }}</BaseButton>
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
</template>
