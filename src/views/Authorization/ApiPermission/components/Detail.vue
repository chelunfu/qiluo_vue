<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'api',
    label: t('apipermission.api'),
    span: 24
  },
  {
    field: 'method',
    label: t('apipermission.method')
  },
  {
    field: 'apiname',
    label: t('apipermission.apiname')
  },
  {
    field: 'sort',
    label: t('role.order')
  },
  {
    field: 'remark',
    label: t('menuuser.remark'),
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
