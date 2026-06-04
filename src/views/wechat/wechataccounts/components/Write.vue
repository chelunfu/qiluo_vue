<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const { required } = useValidator()

const accountTypeOptions = [
  { label: t('wx_accounts.account_type_subscription'), value: 1 },
  { label: t('wx_accounts.account_type_service'), value: 2 },
  { label: t('wx_accounts.account_type_enterprise'), value: 3 },
  { label: t('wx_accounts.account_type_mini_program'), value: 4 }
]

const statusOptions = [
  { label: t('wx_accounts.status_disabled'), value: 0 },
  { label: t('wx_accounts.status_enabled'), value: 1 }
]

const messageModeOptions = [
  { label: t('wx_accounts.message_mode_plaintext'), value: 1 },
  { label: t('wx_accounts.message_mode_compatible'), value: 2 },
  { label: t('wx_accounts.message_mode_security'), value: 3 }
]

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'app_id',
    label: t('wx_accounts.app_id'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'app_secret',
    label: t('wx_accounts.app_secret'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'account_name',
    label: t('wx_accounts.account_name'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'account_type',
    label: t('wx_accounts.account_type'),
    component: 'Select',
    componentProps: {
      options: accountTypeOptions
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('wx_accounts.status'),
    component: 'Select',
    componentProps: {
      options: statusOptions
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'message_mode',
    label: t('wx_accounts.message_mode'),
    component: 'Select',
    componentProps: {
      options: messageModeOptions
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'original_id',
    label: t('wx_accounts.original_id'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'wechat_id',
    label: t('wx_accounts.wechat_id'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'server_url',
    label: t('wx_accounts.server_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'token',
    label: t('wx_accounts.token'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'encoding_aes_key',
    label: t('wx_accounts.encoding_aes_key'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  app_id: [required()],
  app_secret: [required()],
  account_name: [required()],
  account_type: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    console.log(currentRow)
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
