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
    field: 'dict_name',
    label: t('dict_data.dict_name'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'dict_type',
    label: t('dict_data.dict_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'order',
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
  dict_name: [required()],
  dict_type: [required()],
  order: [required()]
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
