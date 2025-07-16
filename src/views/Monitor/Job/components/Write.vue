<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElInput } from 'element-plus'
import { BaseButton } from '@/components/Button'
import { useI18n } from '@/hooks/web/useI18n'
import { VueCron } from '@/components/VueCron'
import { GetDictDataByType, DictType } from '@/api/dictdata'

const { t } = useI18n()

const openCron = ref(false)
const cron_expression = ref('')
const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'task_type',
    label: t('job.task_type'),
    component: 'Select',
    componentProps: {
      options: []
    },
    optionApi: async () => {
      const res = await GetDictDataByType(DictType.SysJob)
      const list = res.data
      const roles = list.map((item) => {
        return {
          label: item.dict_label,
          value: item.dict_value
        }
      })
      return roles
    }
  },
  {
    field: 'job_name',
    label: t('job.job_name'),
    component: 'Input'
  },
  {
    field: 'job_group',
    label: t('job.job_group'),
    component: 'Select',
    componentProps: {
      options: []
    },
    optionApi: async () => {
      const res = await GetDictDataByType(DictType.SysJobGroup)
      const list = res.data
      const roles = list.map((item) => {
        return {
          label: item.dict_label,
          value: item.dict_value
        }
      })
      return roles
    }
  },
  {
    field: 'job_params',
    label: t('job.job_params'),
    component: 'Input'
  },
  {
    field: 'cron_expression',
    label: t('job.cron_expression'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="w-[100%] flex">
              <ElInput
                disabled={true}
                v-model={cron_expression.value}
                placeholder={t('vueCron.expression')}
              />
              <BaseButton type="primary" class="ml-10px" onClick={handleShowCron}>
                {t('vueCron.expression')}
              </BaseButton>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'task_count',
    label: t('job.task_count'),
    component: 'InputNumber'
  },
  {
    field: 'run_count',
    label: t('job.run_count'),
    component: 'InputNumber'
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

const rules = reactive({
  job_name: [required()],
  job_group: [required()],
  cron_expression: [required()],
  remark: [required()]
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
    console.log(formData)
    return formData
  }
}
watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    cron_expression.value = currentRow.cron_expression
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)
const handleShowCron = () => {
  openCron.value = true
}

const closeCron = () => {
  openCron.value = false
}
const setCronExp = async (v: string) => {
  setValues({
    cron_expression: v
  })
  await nextTick()
  await nextTick()
  cron_expression.value = v
}

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <VueCron :open="openCron" @close-dialog="closeCron" @set-cron-exp="setCronExp" />
</template>
