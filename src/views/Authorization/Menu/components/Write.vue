<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { GetMenuTree } from '@/api/menu'

import { cloneDeep } from 'lodash-es'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const changeMenuType = async (val: string) => {
  const formData = await getFormData()
  if (val === 'M') {
    setSchema([
      {
        field: 'component',
        path: 'componentProps.disabled',
        value: true
      }
    ])

    if (formData.id === '0' || formData.pid === '0') {
      setValues({
        component: '#'
      })
    } else {
      setValues({
        component: '##'
      })
    }
  } else if (val === 'C') {
    setSchema([
      {
        field: 'component',
        path: 'componentProps.disabled',
        value: false
      }
    ])
    setValues({
      component: unref(cacheComponent)
    })
  }
}

const formSchema = reactive<FormSchema[]>([
  {
    field: 'menu_type',
    label: t('menu.menutype'),
    component: 'RadioButton',
    value: 0,
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: t('menu.contents'),
          value: 'M'
        },
        {
          label: t('menu.menu'),
          value: 'C'
        }
      ],
      on: {
        change: changeMenuType
      }
    }
  },
  {
    field: 'pid',
    label: t('menu.parentmenu'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      emptyText: ['', t('menu.none')],
      props: {
        label: 'title',
        value: 'id',
        children: 'children',
        emptyValues: ['', t('menu.none')]
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: false,
      on: {
        change: async (val: string) => {
          const formData = await getFormData()
          if (formData.menu_type === 'M') {
            if (val === '0') {
              setValues({
                component: '#'
              })
            } else {
              setValues({
                component: '##'
              })
            }
          }
        }
      }
    },
    optionApi: async () => {
      const res = await GetMenuTree()
      const data = [
        {
          id: '0',
          pid: '-1',
          title: t('menu.topmenu'),
          component: '#',
          children: res.data || []
        }
      ]
      return data
    }
  },
  {
    field: 'title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'component',
    label: t('menu.component'),
    component: 'Input',
    value: '#',
    componentProps: {
      placeholder: '',
      on: {
        change: (val: string) => {
          cacheComponent.value = val
        }
      }
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'icon',
    label: t('menu.icon'),
    component: 'IconPicker',
    value: 'vi-tdesign:archway'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'redirect',
    label: t('menu.redirect'),
    component: 'Input'
  },
  {
    field: 'order',
    label: t('menu.order'),
    component: 'InputNumber',
    componentProps: {
      type: 'number'
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('status.disable'),
          value: '1'
        },
        {
          label: t('status.enable'),
          value: '0'
        }
      ]
    }
  },
  {
    field: 'activeMenu',
    label: t('menu.activeMenu'),
    component: 'Switch'
  },
  {
    field: 'hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'noCache',
    label: t('menu.noCache'),
    component: 'Switch'
  },
  {
    field: 'breadcrumb',
    label: t('menu.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'affix',
    label: t('menu.affix'),
    component: 'Switch'
  },
  {
    field: 'noTagsView',
    label: t('menu.noTagsView'),
    component: 'Switch'
  },
  {
    field: 'canTo',
    label: t('menu.canTo'),
    component: 'Switch'
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

const rules = {
  component: [required()],
  path: [required()],
  order: [required()],
  title: [required()],
  noCache: [required()]
}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

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

const cacheComponent = ref('')

watch(
  () => props.currentRow,
  (value) => {
    if (!value) return
    const currentRow = cloneDeep(value)
    cacheComponent.value = currentRow.menu_type === 'C' ? currentRow.component : '##'
    if (currentRow.pid === '0') {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    }

    if (currentRow.menu_type === 'M') {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
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
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
