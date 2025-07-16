<script setup lang="ts">
import { ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
defineProps({
  currentRow: {
    type: Object,
    default: () => undefined
  }
})
const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'user_name',
    label: t('menuuser.username')
  },
  {
    field: 'nick_name',
    label: t('menuuser.nickname')
  },
  {
    field: 'email',
    label: t('menuuser.email')
  },
  {
    field: 'phonenumber',
    label: t('menuuser.phone')
  },
  {
    field: 'dept_ids',
    label: t('menuuser.department')
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
