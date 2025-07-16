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
    field: 'dict_type',
    label: t('dict_data.dict_type'),
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'dict_label',
    label: t('dict_data.dict_label'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'label'
    }
  },
  {
    field: 'dict_value',
    label: t('dict_data.dict_value'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'key'
    }
  },
  {
    field: 'dict_sort',
    label: t('role.order'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'remark',
    label: t('role.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  dict_type: [required()],
  dict_label: [required()],
  dict_value: [required()],
  dict_sort: [required()]
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
