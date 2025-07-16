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
    label: t('wx_auto_replies.id'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'reply_type',
    label: t('wx_auto_replies.reply_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'keyword',
    label: t('wx_auto_replies.keyword'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'match_type',
    label: t('wx_auto_replies.match_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'message_type',
    label: t('wx_auto_replies.message_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content',
    label: t('wx_auto_replies.content'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'title',
    label: t('wx_auto_replies.title'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'description',
    label: t('wx_auto_replies.description'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'pic_url',
    label: t('wx_auto_replies.pic_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'url',
    label: t('wx_auto_replies.url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'music_url',
    label: t('wx_auto_replies.music_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'hq_music_url',
    label: t('wx_auto_replies.hq_music_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('wx_auto_replies.status'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'priority',
    label: t('wx_auto_replies.priority'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({ id: [required()], reply_type: [required()], message_type: [required()] })

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
