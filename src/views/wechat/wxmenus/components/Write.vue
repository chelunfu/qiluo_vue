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
    label: t('wx_menus.id'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_name',
    label: t('wx_menus.menu_name'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_type',
    label: t('wx_menus.menu_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_key',
    label: t('wx_menus.menu_key'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'url',
    label: t('wx_menus.url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'appid',
    label: t('wx_menus.appid'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'pagepath',
    label: t('wx_menus.pagepath'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'sort_order',
    label: t('wx_menus.sort_order'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('wx_menus.status'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({ id: [required()], menu_name: [required()], menu_type: [required()] })

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
