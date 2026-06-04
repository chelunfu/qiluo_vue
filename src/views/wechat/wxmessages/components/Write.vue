<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { GetWxAccountsList } from '@/api/wx_accounts'

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
    field: 'account_id',
    label: t('wx_messages.account_id'),
    component: 'Select',
    componentProps: {
      filterable: true
    },
    optionApi: async () => {
      const res = await GetWxAccountsList({ page_num: 1, page_size: 100 })
      return (res.data.list || []).map((item: any) => ({
        label: item.account_name,
        value: item.id
      }))
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'openid',
    label: t('wx_messages.openid'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'msg_type',
    label: t('wx_messages.msg_type'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_messages.msg_type_text'), value: 'text' },
        { label: t('wx_messages.msg_type_image'), value: 'image' },
        { label: t('wx_messages.msg_type_voice'), value: 'voice' },
        { label: t('wx_messages.msg_type_video'), value: 'video' },
        { label: t('wx_messages.msg_type_event'), value: 'event' },
        { label: t('wx_messages.msg_type_link'), value: 'link' }
      ]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'direction',
    label: t('wx_messages.direction'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_messages.direction_receive'), value: 1 },
        { label: t('wx_messages.direction_send'), value: 2 }
      ]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'content',
    label: t('wx_messages.content'),
    component: 'InputTextarea',
    colProps: {
      span: 24
    }
  },
  {
    field: 'is_auto_reply',
    label: t('wx_messages.is_auto_reply'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_messages.is_auto_reply_no'), value: 0 },
        { label: t('wx_messages.is_auto_reply_yes'), value: 1 }
      ]
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  account_id: [required()],
  openid: [required()],
  msg_type: [required()],
  direction: [required()]
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
