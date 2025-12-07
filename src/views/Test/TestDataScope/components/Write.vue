<script setup lang="tsx">
import { Form, FormSchema, CheckboxOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxButton, CheckboxValueType } from 'element-plus'
import { GetMenuList } from '@/api/menu'
import { eachTree } from '@/utils/tree'
import { get_role_menus_api, get_role_depts } from '@/api/role'
import { GetDeptTree } from '@/api/department'
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
    field: 'title',
    label: t('testdatascope.title'),
    component: 'Input'
  },
  {
    field: 'content',
    label: t('testdatascope.content'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 8
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('role.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('menuuser.disable'),
          value: '1'
        },
        {
          label: t('menuuser.enable'),
          value: '0'
        }
      ]
    }
  }
])

const rules = reactive({
  title: [required()],
  content: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, delSchema, addSchema } = formMethods

const treeData = ref([])
const treeDeptData = ref([])

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
