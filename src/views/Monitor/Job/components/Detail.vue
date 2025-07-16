<script setup lang="tsx">
import { PropType, ref, nextTick } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag } from 'element-plus'

import { GetMenuList } from '@/api/menu'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const treeData = ref<any[]>([])
const getMenuList = async () => {
  const res = await GetMenuList()
  if (res) {
    treeData.value = res.data.list
    await nextTick()
  }
}
getMenuList()

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'job_name',
    label: t('job.job_name')
  },
  { field: 'cron_expression', label: t('job.cron_expression') },
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
    label: '状态',
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'remark',
    label: '备注',
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
