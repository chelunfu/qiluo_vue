<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
const { t } = useI18n()

const userStore = useUserStore()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  { field: 'name', label: t('menuuser.name'), component: 'Input' },
  { field: 'description', label: t('menuuser.description'), component: 'InputTextarea' },
  { field: 'sort', label: t('menuuser.sort'), component: 'InputNumber' },
  {
    field: 'status',
    label: t('menuuser.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: '选项一', value: 1 },
        { label: '选项二', value: 2 }
      ]
    }
  },
  {
    field: 'cover',
    label: t('menuuser.cover'),
    component: 'Upload',
    componentProps: {
      action: '/api/sys/upload',
      accept: 'image/*',
      limit: 1,
      headers: { Authorization: userStore.getTokenType + ' ' + userStore.getToken },
      on: {
        success: (response: any, uploadFile: any) => {
          uploadFile.url = response.data
        },
        exceed: () => {
          ElMessage.warning('最多只能上传1个文件')
        },
        beforeUpload: (rawFile: any) => {
          if (rawFile.size / 1024 / 1024 > 2) {
            ElMessage.error('文件大小不能超过2MB')
            return false
          }
          return true
        }
      },
      slots: {
        trigger: () => <el-button type="primary">点击上传</el-button>,
        tip: () => <div style="color: #999; font-size: 12px">只能上传图片文件，且不超过2MB</div>
      }
    }
  },
  { field: 'is_active', label: t('menuuser.is_active'), component: 'Switch' },
  { field: 'weight', label: t('menuuser.weight'), component: 'InputNumber' },
  { field: 'view_count', label: t('menuuser.view_count'), component: 'Input' }
])

const rules = reactive({
  sort: [{ required: true, message: t('menuuser.sort') + t('button.required'), trigger: 'blur' }],
  status: [
    { required: true, message: t('menuuser.status') + t('button.required'), trigger: 'blur' }
  ]
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
    if (formData.cover && Array.isArray(formData.cover)) {
      formData.cover = formData.cover
        .map((f: any) => f.url || f.response?.data || f.name)
        .filter(Boolean)
        .join(',')
    }
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    if (currentRow.cover && typeof currentRow.cover === 'string') {
      currentRow.cover = currentRow.cover
        .split(',')
        .filter(Boolean)
        .map((url: string) => ({ url, name: url.split('/').pop() || url, status: 'success' }))
    }
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
  <Form @register="formRegister" :schema="formSchema" :rules="rules" />
</template>
