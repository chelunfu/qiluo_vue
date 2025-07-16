<script lang="ts" setup>
import { FormSchema, Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { reactive, ref, watch } from 'vue'
import { ElDivider, ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

const { required, phone, maxlength, email } = useValidator()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'nickname',
    label: t('personal.nickname'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'phone',
    label: t('personal.phone'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'email',
    label: t('personal.email'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  nickname: [required(), maxlength(50)],
  phone: [phone()],
  email: [email()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose } = formMethods

watch(
  () => props.userInfo,
  (value) => {
    setValues(value)
  },
  {
    immediate: true,
    deep: true
  }
)

const saveLoading = ref(false)
const save = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    ElMessageBox.confirm(t('personal.issuremodified'), t('personal.tips'), {
      confirmButtonText: t('personal.sure'),
      cancelButtonText: t('personal.cancel'),
      type: 'warning'
    })
      .then(async () => {
        try {
          saveLoading.value = true
          // 这里可以调用修改用户信息接口
          ElMessage.success(t('personal.modifiedsucess'))
        } catch (error) {
          console.log(error)
        } finally {
          saveLoading.value = false
        }
      })
      .catch(() => {})
  }
}
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <ElDivider />
  <BaseButton type="primary" @click="save">{{ t('personal.save') }}</BaseButton>
</template>
