<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ApiPermissionList } from '@/api/apipermission'
import { role_api_transfer_list } from '@/api/roleapi'
const { t } = useI18n()

const vdata = ref<string[]>([])

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'api_ids',
    label: t('form.default'),
    component: 'Transfer',
    componentProps: {
      props: {
        key: 'id',
        label: 'api'
      },
      titles: ['API', t('role.selectapi')],
      filterable: true,
      filterPlaceholder: t('role.selectapi'),
      format: {
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      },
      slots: {
        default: ({ option }) => {
          return (
            <span>
              {option.api} - {option.apiname}
            </span>
          )
        }
      }
    },
    colProps: {
      span: 24
    },
    optionApi: async () => {
      const res = await ApiPermissionList({ page_num: 1, page_size: 1000 })

      return res.data.list.map((item: any) => {
        return {
          id: item.id,
          api: item.api,
          apiname: item.apiname,
          method: item.method
        }
      })
    }
  }
])

const translist = async () => {
  const res = await role_api_transfer_list({ role_id: props.currentRow.role_id })
  vdata.value = res.data.map((item: any) => {
    return item.api_id
  })
  console.log(vdata.value)
  setSchema([
    {
      field: 'api_ids',
      path: 'value',
      value: unref(vdata)
    }
  ])
}
translist()
const rules = reactive({})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    console.log(formData)
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

<style lang="less" scoped>
:deep(.el-transfer-panel) {
  width: 40% !important;
  height: 100% !important;
}

:deep(.el-transfer-panel__list.is-filterable) {
  height: 100%;
}

:deep(.el-transfer-panel__list) {
  height: 100%;
}
</style>
