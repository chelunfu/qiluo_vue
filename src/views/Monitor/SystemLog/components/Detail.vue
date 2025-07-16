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
  return (
    <ElTag type={!enable ? 'danger' : 'success'}>
      {enable ? t('systemlog.success') : t('systemlog.fail')}
    </ElTag>
  )
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
    field: 'api_name',
    label: t('systemlog.api_name')
  },
  {
    field: 'status',
    label: t('systemlog.status'),
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },

  {
    field: 'oper_name',
    label: t('systemlog.oper_name')
  },
  {
    field: 'request_method',
    label: t('systemlog.request_method')
  },
  {
    field: 'oper_url',
    label: t('systemlog.oper_url'),
    span: 24
  },
  {
    field: 'oper_ip',
    label: t('systemlog.oper_ip')
  },
  {
    field: 'oper_location',
    label: t('systemlog.oper_location')
  },

  {
    field: 'cost_time',
    label: t('systemlog.cost_time')
  },
  {
    field: 'json_result',
    label: t('systemlog.json_result'),
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
