<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'id',
    label: t('wx_accounts.id'),
    component: 'InputNumber',
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
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('wx_accounts.status'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'access_token',
    label: t('wx_accounts.access_token'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'token_expires_at',
    label: t('wx_accounts.token_expires_at'),
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
  id: [required()],
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
