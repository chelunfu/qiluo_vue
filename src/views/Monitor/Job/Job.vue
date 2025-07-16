<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { GetJobList, AddJob, EditJob, HandExecuteJob, DelJob } from '@/api/job'
import { GetDictDataByType, DictType } from '@/api/dictdata'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag, ElTooltip, ElLink, ElMessageBox, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
const { push } = useRouter()
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await GetJobList({
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total
    }
  }
})

const { dataList, loading, total, page_size, page_num } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'task_type',
    label: t('job.task_type'),
    slots: {
      default: (data: any) => {
        const dict_type = data.row.task_type
        const task_type_name = dicts.value.find(
          (item: any) => item.dict_value === dict_type
        )?.dict_label

        return <>{task_type_name}</>
      }
    }
  },
  {
    field: 'job_name',
    label: t('job.job_name'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElLink type="primary" onClick={() => godata(data.row)}>
              {data.row.job_name}
            </ElLink>
          </>
        )
      }
    }
  },
  {
    field: 'job_group',
    label: t('job.job_group')
  },
  {
    field: 'cron_expression',
    label: t('job.cron_expression')
  },
  {
    field: 'job_params',
    label: t('job.job_params')
  },
  {
    field: 'task_count',
    label: t('job.task_count')
  },
  {
    field: 'run_count',
    label: t('job.run_count')
  },
  {
    field: 'status',
    label: t('menu.status'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        const status = data.row.status
        console.log()
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
    label: t('job.remark')
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
            <ElTooltip content={t('button.edit')} placement="bottom">
              <BaseButton size="small" type="primary" onClick={() => action(row, 'edit')}>
                <Icon icon="vi-ant-design:edit-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip content={t('button.detail')} placement="bottom">
              <BaseButton size="small" type="success" onClick={() => action(row, 'detail')}>
                <Icon icon="vi-ant-design:file-text-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip content={t('button.execute')} placement="bottom">
              <BaseButton size="small" type="warning" onClick={() => execute_job(row)}>
                <Icon icon="vi-tdesign:play" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip content={t('button.del')} placement="bottom">
              <BaseButton size="small" type="danger" onClick={() => del_job(row)}>
                <Icon icon="vi-ant-design:delete-filled" />
              </BaseButton>
            </ElTooltip>
          </>
        )
      }
    }
  }
])

const godata = (row: any) => {
  push({
    path: `/motion/joblog`,
    query: {
      job_id: row.job_id
    },
    state: {
      jobdata: {
        job_name: row.job_name,
        job_group: row.job_group,
        task_type: dicts.value.find((item: any) => item.dict_value === row.task_type).dict_label,
        job_params: row.job_params
      }
    }
  })
}
const del_job = async (row: any) => {
  ElMessageBox.confirm(t('job.del_job_confirm'), t('job.del_job'), {
    confirmButtonText: t('common.delOk'),
    cancelButtonText: t('common.delCancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await DelJob({ job_id: row.job_id })
      if (res) {
        getList()
        ElMessage.success(t('job.del_job_success'))
      } else {
        ElMessage.error(t('job.del_job_fail'))
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.delCancel')
      })
    })
}
const execute_job = async (row: any) => {
  ElMessageBox.confirm(t('job.execute_job'), t('common.delWarning'), {
    confirmButtonText: t('common.delOk'),
    cancelButtonText: t('common.delCancel'),
    type: 'warning'
  })
    .then(async () => {
      const res = await HandExecuteJob({ job_id: row.job_id })
      if (res) {
        ElMessage.success(t('job.execute_success'))
      } else {
        ElMessage.error(t('job.execute_fail'))
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.delCancel')
      })
    })
}
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'job_name',
    label: t('job.job_name'),
    component: 'Input'
  },
  {
    field: 'task_type',
    label: t('job.task_type'),
    component: 'Input'
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dicts = ref<any>([])
const useDicts = async () => {
  const res = await GetDictDataByType(DictType.SysJob)

  dicts.value = res.data
}

useDicts()
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
const AddAction = () => {
  dialogTitle.value = t('dialog.add')
  actionType.value = 'add'
  const jobAddRow = {
    job_name: '',
    job_params: '',
    task_type: 'geturl',
    cron_expression: '',
    job_group: 'default',
    task_count: 0,
    run_count: 0,
    status: '0',
    remark: ''
  }
  currentRow.value = jobAddRow
  dialogVisible.value = true
}
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    console.log(formData)
    //const roleEdit: RoleEditReq = {}
    if (actionType.value === 'edit') {
      const res = await EditJob(formData)
      if (res) {
        getList()
      }
    } else {
      const res = await AddJob(formData)
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
      <BaseButton type="primary" @click="AddAction()">{{ t('button.add') }}</BaseButton>
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
    <Detail v-else :current-row="currentRow" />

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
