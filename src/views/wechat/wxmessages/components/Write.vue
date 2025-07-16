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
    label: t('wx_messages.id'),
    component: 'InputNumber',
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
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'direction',
    label: t('wx_messages.direction'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content',
    label: t('wx_messages.content'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'pic_url',
    label: t('wx_messages.pic_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'voice_format',
    label: t('wx_messages.voice_format'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'recognition',
    label: t('wx_messages.recognition'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'msg_title',
    label: t('wx_messages.msg_title'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'msg_description',
    label: t('wx_messages.msg_description'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'link_url',
    label: t('wx_messages.link_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'event_type',
    label: t('wx_messages.event_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'event_key',
    label: t('wx_messages.event_key'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'is_auto_reply',
    label: t('wx_messages.is_auto_reply'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  id: [required()],
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
