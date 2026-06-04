<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { GetWxAccountsList } from '@/api/wx_accounts'

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
    field: 'account_id',
    label: t('wx_materials.account_id'),
    component: 'Select',
    componentProps: {
      filterable: true
    },
    optionApi: async () => {
      const res = await GetWxAccountsList({ page_num: 1, page_size: 100 })
      return (res.data.list || []).map((item: any) => ({
        label: item.account_name,
        value: item.id
      }))
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'media_type',
    label: t('wx_materials.media_type'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.media_type_image'), value: 'image' },
        { label: t('wx_materials.media_type_voice'), value: 'voice' },
        { label: t('wx_materials.media_type_video'), value: 'video' },
        { label: t('wx_materials.media_type_thumb'), value: 'thumb' },
        { label: t('wx_materials.media_type_news'), value: 'news' }
      ]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'name',
    label: t('wx_materials.name'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'media_id',
    label: t('wx_materials.media_id'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'url',
    label: t('wx_materials.url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'local_path',
    label: t('wx_materials.local_path'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'file_size',
    label: t('wx_materials.file_size'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content_type',
    label: t('wx_materials.content_type'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'width',
    label: t('wx_materials.width'),
    component: 'InputNumber',
    colProps: {
      span: 12
    }
  },
  {
    field: 'height',
    label: t('wx_materials.height'),
    component: 'InputNumber',
    colProps: {
      span: 12
    }
  },
  {
    field: 'duration',
    label: t('wx_materials.duration'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'title',
    label: t('wx_materials.title'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'author',
    label: t('wx_materials.author'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'digest',
    label: t('wx_materials.digest'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'description',
    label: t('wx_materials.description'),
    component: 'InputTextarea',
    colProps: {
      span: 24
    }
  },
  {
    field: 'introduction',
    label: t('wx_materials.introduction'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'thumb_media_id',
    label: t('wx_materials.thumb_media_id'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'thumb_url',
    label: t('wx_materials.thumb_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content_source_url',
    label: t('wx_materials.content_source_url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'content',
    label: t('wx_materials.content'),
    component: 'InputTextarea',
    colProps: {
      span: 24
    }
  },
  {
    field: 'is_permanent',
    label: t('wx_materials.is_permanent'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.permanent_yes'), value: 1 },
        { label: t('wx_materials.permanent_no'), value: 0 }
      ]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'sync_status',
    label: t('wx_materials.sync_status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('wx_materials.sync_status_synced'), value: 1 },
        { label: t('wx_materials.sync_status_not_synced'), value: 0 }
      ]
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({ account_id: [required()], media_type: [required()] })

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
