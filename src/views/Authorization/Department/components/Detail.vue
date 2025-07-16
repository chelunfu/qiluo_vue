<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { ElTag } from 'element-plus'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'dept_name',
    label: t('menuuser.departmentName')
  },
  {
    field: 'order',
    label: t('role.order')
  },
  {
    field: 'leader',
    label: t('menuuser.leader')
  },
  {
    field: 'phone',
    label: t('menuuser.phone')
  },
  {
    field: 'email',
    label: t('menuuser.email')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data) => {
        return renderTag(data.status === '0')
      }
    }
  },
  {
    field: 'remark',
    label: t('menuuser.remark'),
    span: 24
  }
])
const renderTag = (enable?: boolean) => {
  return (
    <ElTag type={!enable ? 'danger' : 'success'}>
      {enable ? t('menu.enable') : t('menu.disable')}
    </ElTag>
  )
}
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
