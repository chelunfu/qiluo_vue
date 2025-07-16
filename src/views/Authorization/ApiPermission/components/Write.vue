<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { DictType, GetDictDataByType } from '@/api/dictdata'
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
    field: 'api',
    label: t('apipermission.api'),
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'logcache',
    label: t('apipermission.logcache'),
    component: 'Select',
    componentProps: {
      options: []
    },
    colProps: {
      span: 24
    },
    optionApi: async () => {
      const res = await GetDictDataByType(DictType.SysLogcache)
      const list = res.data
      const roles = list.map((item: any) => {
        return {
          label: item.dict_label,
          value: item.dict_value
        }
      })
      return roles
    }
  },
  {
    field: 'sort',
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
  logcache: [required()],
  sort: [required()]
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
