<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage, ElMessageBox, ElDivider } from 'element-plus'
import { PutResetPassword } from '@/api/user/index'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const { required, lengthRange } = useValidator()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'old_password',
    label: t('personal.oldpassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    }
  },
  {
    field: 'new_password',
    label: t('personal.newpassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      strength: true
    }
  },
  {
    field: 'new_password2',
    label: t('personal.confirmnewpassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      strength: true
    }
  }
])

const rules = reactive({
  old_password: [
    required(),
    lengthRange({
      min: 6,
      max: 32
    })
  ],
  new_password: [
    required(),
    {
      asyncValidator: async (_, val, callback) => {
        const formData = await getFormData()
        const { new_password2 } = formData
        if (val !== new_password2) {
          callback(new Error(t('personal.passwordnotmatch')))
        } else {
          callback()
        }
      }
    },
    lengthRange({
      min: 6,
      max: 32
    })
  ],
  new_password2: [
    required(),
    {
      asyncValidator: async (_, val, callback) => {
        const formData = await getFormData()
        const { new_password } = formData
        if (val !== new_password) {
          callback(new Error(t('personal.passwordnotmatch')))
        } else {
          callback()
        }
      }
    },
    lengthRange({
      min: 6,
      max: 32
    })
  ]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

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
          const formData = await getFormData()
          console.log(formData)
          const res = await PutResetPassword(formData)
          if (res) {
            ElMessage.success(t('personal.modifiedsucess'))
          }
          // 这里可以调用修改密码的接口
          else ElMessage.error(t('personal.modifiedfail'))
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
  <BaseButton type="primary" @click="save">确认修改</BaseButton>
</template>
