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
    label: t('wx_users.id'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'openid',
    label: t('wx_users.openid'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'unionid',
    label: t('wx_users.unionid'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'nickname',
    label: t('wx_users.nickname'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'sex',
    label: t('wx_users.sex'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'city',
    label: t('wx_users.city'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'country',
    label: t('wx_users.country'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'province',
    label: t('wx_users.province'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'language',
    label: t('wx_users.language'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'headimgurl',
    label: t('wx_users.headimgurl'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'subscribe_time',
    label: t('wx_users.subscribe_time'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'unsubscribe_time',
    label: t('wx_users.unsubscribe_time'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'subscribe_status',
    label: t('wx_users.subscribe_status'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'remark',
    label: t('wx_users.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'subscribe_scene',
    label: t('wx_users.subscribe_scene'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'qr_scene',
    label: t('wx_users.qr_scene'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'qr_scene_str',
    label: t('wx_users.qr_scene_str'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'last_interact_time',
    label: t('wx_users.last_interact_time'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'message_count',
    label: t('wx_users.message_count'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({ id: [required()], openid: [required()] })

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
