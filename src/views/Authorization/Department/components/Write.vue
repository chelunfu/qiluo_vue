<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { GetDeptTree } from '@/api/department'

const { t } = useI18n()
const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  actionType: {
    type: String,
    default: 'add'
  }
  // ,
  //   formSchema: {
  //     type: Array as PropType<FormSchema[]>,
  //     default: () => []
  //   }
})
const formSchema = reactive<FormSchema[]>([
  {
    field: 'parent_id',
    label: t('menuuser.superiorDepartment'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'dept_id',
      props: {
        label: 'dept_name'
      },
      checkStrictly: true,
      checkOnClickNode: true
    },
    optionApi: async () => {
      const res = await GetDeptTree()
      console.log(res)
      return res.data.list
    }
  },
  {
    field: 'dept_name',
    label: t('menuuser.departmentName'),
    component: 'Input'
  },
  {
    field: 'order',
    label: t('role.order'),
    component: 'InputNumber'
  },
  {
    field: 'leader',
    label: t('menuuser.leader'),
    component: 'Input'
  },
  {
    field: 'phone',
    label: t('menuuser.phone'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('menuuser.email'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menuuser.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '1',
          label: t('menuuser.disable')
        },
        {
          value: '0',
          label: t('menuuser.enable')
        }
      ]
    }
  },
  {
    field: 'remark',
    label: t('menuuser.remark'),
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
  dept_name: [required()],
  order: [required()],
  status: [required()]
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
