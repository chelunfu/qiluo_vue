<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { GetRoleTree } from '@/api/role'
const { t } = useI18n()
const { required } = useValidator()
const formRef = ref<typeof Form>()
const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  },
  actionType: {
    type: String,
    default: 'add'
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'user_name',
    label: t('menuuser.username'),
    component: 'Input',
    componentProps: {
      placeholder: t('menuuser.plaseinputusername')
    }
  },
  {
    field: 'password',
    label: t('menuuser.password'),
    component: 'InputPassword',
    componentProps: {
      placeholder: t('menuuser.plaseinputpassword')
    }
  },
  {
    field: 'nick_name',
    label: t('menuuser.nickname'),
    component: 'Input',
    componentProps: {
      placeholder: t('menuuser.plaseinpoutnicename')
    }
  },
  {
    field: 'dept_ids',
    label: t('menuuser.department'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'dept_id',
      props: {
        label: 'dept_name'
      },
      multiple: true,
      checkStrictly: true
    }
  },
  {
    field: 'dept_id',
    label: t('menuuser.activedept'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'dept_id',
      props: {
        label: 'dept_name'
      },
      checkStrictly: true
    }
  },
  {
    field: 'role_ids',
    label: t('menuuser.role'),
    component: 'SelectV2',
    componentProps: {
      options: [],
      multiple: true
    },
    optionApi: async () => {
      const res = await GetRoleTree()
      const list = res.data
      const roles = list.map((item) => {
        return {
          label: item.role_name,
          value: item.role_id
        }
      })
      return roles
    }
  },
  {
    field: 'role_id',
    label: t('menuuser.activerole'),
    component: 'SelectV2',
    componentProps: {
      options: []
    },
    optionApi: async () => {
      const res = await GetRoleTree()
      const list = res.data
      const roles = list.map((item) => {
        return {
          label: item.role_name,
          value: item.role_id
        }
      })
      return roles
    }
  },
  {
    field: 'email',
    label: t('menuuser.email'),
    component: 'Input'
  },
  {
    field: 'phonenumber',
    label: t('menuuser.phone'),
    component: 'Input'
  },
  {
    field: 'sex',
    label: t('menuuser.sex'),
    component: 'Select',
    componentProps: {
      placeholder: t('menuuser.plaseselectstatus'),
      options: [
        {
          label: t('menuuser.female'),
          value: '0'
        },
        {
          label: t('menuuser.male'),
          value: '1'
        },
        {
          label: t('menuuser.unknown'),
          value: '2'
        }
      ]
    }
  },
  {
    field: 'status',
    label: t('menuuser.status'),
    component: 'Select',
    componentProps: {
      placeholder: t('menuuser.plaseselectstatus'),
      options: [
        {
          label: t('menuuser.enable'),
          value: '0'
        },
        {
          label: t('menuuser.disable'),
          value: '1'
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
      rows: 2
    },
    colProps: {
      span: 24
    }
  }
])

const checkDeptId = async (_: any, value: any, callback: any) => {
  const formData = await getFormData()
  const { dept_ids } = formData
  if (value === '') {
    callback(new Error(t('menuuser.activedeptnonull')))
  } else if (!dept_ids.includes(value)) {
    callback(new Error(t('menuuser.mustactivedept')))
  } else {
    callback()
  }
}

const checkDeptIds = async (_: any, value: any, callback: any) => {
  if (value === '' || value.length === 0) {
    callback(new Error(t('menuuser.userdeptnonull')))
  } else {
    const formData = await getFormData()
    const { dept_id } = formData
    if (dept_id) {
      const elForm = await getElFormExpose()
      elForm?.validateField('dept_id').catch((err) => {
        console.log(err)
      })
    }
    callback()
  }
}

const checkRoleId = async (_: any, value: any, callback: any) => {
  const formData = await getFormData()
  const { role_ids } = formData
  if (value === '') {
    callback(new Error(t('menuuser.activerolenonull')))
  } else if (!role_ids.includes(value)) {
    callback(new Error(t('menuuser.mustactiverolenull')))
  } else {
    callback()
  }
}
const checkRoleIds = async (_: any, value: any, callback: any) => {
  if (value === '' || value.length === 0) {
    callback(new Error(t('menuuser.userrolenonull')))
  } else {
    const formData = await getFormData()
    const { role_id } = formData
    if (role_id) {
      const elForm = await getElFormExpose()
      elForm?.validateField('role_id').catch((err) => {
        console.log(err)
      })
    }
    callback()
  }
}
const rules = reactive({
  user_name: [required()],
  nick_name: [required()],
  dept_ids: [{ asyncValidator: checkDeptIds }, required()],
  dept_id: [{ asyncValidator: checkDeptId }, required()],
  role_ids: [{ asyncValidator: checkRoleIds }, required()],
  role_id: [{ asyncValidator: checkRoleId }, required()],
  password: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema, delSchema } = formMethods

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
  () => props.actionType,
  (actionType) => {
    if (actionType === 'edit') delSchema('password')
  },
  {
    immediate: true
  }
)
watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setSchema([
      {
        field: 'dept_id',
        path: 'componentProps.data',
        value: currentRow.department
      },
      {
        field: 'dept_ids',
        path: 'componentProps.data',
        value: currentRow.department
      }
    ])
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
  <Form ref="formRef" :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
