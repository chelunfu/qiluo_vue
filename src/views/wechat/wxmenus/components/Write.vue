<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { GetWxAccountsList } from '@/api/wx_accounts'
import { GetWxMenusList } from '@/api/wechat/wxmenus_api'

const { t } = useI18n()

const { required } = useValidator()

const menuTypeOptions = [
  { label: t('wx_menus.menu_type_click'), value: 'click' },
  { label: t('wx_menus.menu_type_view'), value: 'view' },
  { label: t('wx_menus.menu_type_scancode_push'), value: 'scancode_push' },
  { label: t('wx_menus.menu_type_scancode_waitmsg'), value: 'scancode_waitmsg' },
  { label: t('wx_menus.menu_type_pic_sysphoto'), value: 'pic_sysphoto' },
  { label: t('wx_menus.menu_type_pic_photo_or_album'), value: 'pic_photo_or_album' },
  { label: t('wx_menus.menu_type_pic_weixin'), value: 'pic_weixin' },
  { label: t('wx_menus.menu_type_location_select'), value: 'location_select' },
  { label: t('wx_menus.menu_type_media_id'), value: 'media_id' },
  { label: t('wx_menus.menu_type_article_id'), value: 'article_id' },
  { label: t('wx_menus.menu_type_article_view_limited'), value: 'article_view_limited' },
  { label: t('wx_menus.menu_type_miniprogram'), value: 'miniprogram' }
]

const statusOptions = [
  { label: t('wx_menus.status_disabled'), value: 0 },
  { label: t('wx_menus.status_enabled'), value: 1 }
]

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'account_id',
    label: t('wx_menus.account_id'),
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
    field: 'parent_id',
    label: t('wx_menus.parent_id'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        label: 'menu_name',
        value: 'id',
        children: 'children'
      },
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true,
      placeholder: t('wx_menus.parent_id_placeholder')
    },
    optionApi: async () => {
      const res = await GetWxMenusList({ page_num: 1, page_size: 500 })
      return res.data.list || []
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_name',
    label: t('wx_menus.menu_name'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_type',
    label: t('wx_menus.menu_type'),
    component: 'Select',
    componentProps: {
      options: menuTypeOptions
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu_key',
    label: t('wx_menus.menu_key'),
    component: 'Input',
    componentProps: {
      placeholder: t('wx_menus.menu_key_placeholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'url',
    label: t('wx_menus.url'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'media_id',
    label: t('wx_menus.media_id'),
    component: 'Input',
    componentProps: {
      placeholder: t('wx_menus.media_id_placeholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'appid',
    label: t('wx_menus.appid'),
    component: 'Input',
    componentProps: {
      placeholder: t('wx_menus.appid_placeholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'pagepath',
    label: t('wx_menus.pagepath'),
    component: 'Input',
    componentProps: {
      placeholder: t('wx_menus.pagepath_placeholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'article_id',
    label: t('wx_menus.article_id'),
    component: 'Input',
    componentProps: {
      placeholder: t('wx_menus.article_id_placeholder')
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'sort_order',
    label: t('wx_menus.sort_order'),
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'status',
    label: t('wx_menus.status'),
    component: 'Select',
    componentProps: {
      options: statusOptions
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  account_id: [required()],
  menu_name: [required()],
  menu_type: [required()]
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
