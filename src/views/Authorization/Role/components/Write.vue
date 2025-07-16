<script setup lang="tsx">
import { Form, FormSchema, CheckboxOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxButton, CheckboxValueType } from 'element-plus'
import { GetMenuList } from '@/api/menu'
import { eachTree } from '@/utils/tree'
import { data_scope_values } from '@/api/role/types'
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

const treeMenuRef = ref<typeof ElTree>()
const treeDeptRef = ref<typeof ElTree>()
const MenuChange = (v: CheckboxValueType, c: string) => {
  if (c === '1') {
    handleMenuExpand(v as boolean)
  }
  if (c === '2') {
    handleMenuNodeAll(v as boolean)
  }
}
const dataScopeChange = (val) => {
  if (val === '2') {
    datascopeform.forEach((item) => {
      addSchema(item)
    })

    getDeptList()
  } else {
    delSchema('data_depts')
    delSchema('field428')
  }
}
const datascopeform: FormSchema[] = [
  {
    field: 'field428',
    label: t('role.dataScope'),
    component: 'CheckboxGroup',
    value: [],
    componentProps: {
      options: [
        {
          label: t('role.expand'),
          value: '1'
        },
        {
          label: t('role.allselected'),
          value: '2'
        }
      ],
      slots: {
        default: (options: CheckboxOption[]) => {
          return options?.map((v) => {
            return (
              <ElCheckboxButton
                label={v.label}
                value={v.value}
                onChange={(a) => DeptChange(a, v.value as string)}
              />
            )
          })
        }
      }
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'data_depts',
    label: t('role.dataScope'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeDeptRef}
                    show-checkbox
                    node-key="dept_id"
                    highlight-current
                    checkStrictly
                    expand-on-click-node={false}
                    data={treeDeptData.value}
                  >
                    {{
                      default: (data) => {
                        return <span>{data.data.dept_name}</span>
                      }
                    }}
                  </ElTree>
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
]
const formSchema = ref<FormSchema[]>([
  {
    field: 'role_name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'role_key',
    label: t('role.rolekey'),
    component: 'Input'
  },
  {
    field: 'order',
    label: t('role.order'),
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
  },
  {
    field: 'field10',
    component: 'Divider',
    label: t('role.menu')
  },
  {
    field: 'field42-2',
    label: t('role.menu'),
    component: 'CheckboxGroup',
    value: [],
    componentProps: {
      options: [
        {
          label: t('role.expand'),
          value: '1'
        },
        {
          label: t('role.allselected'),
          value: '2'
        }
      ],
      slots: {
        default: (options: CheckboxOption[]) => {
          return options?.map((v) => {
            return (
              <ElCheckboxButton
                label={v.label}
                value={v.value}
                onChange={(a) => MenuChange(a, v.value as string)}
              />
            )
          })
        }
      }
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <ElTree
                ref={treeMenuRef}
                show-checkbox
                node-key="id"
                highlight-current
                expand-on-click-node={false}
                data={treeData.value}
                onNode-click={nodeClick}
                onCheck-change={handleCheckChange}
                check-strictly
              >
                {{
                  default: (data) => {
                    return <span>{data.data.title}</span>
                  }
                }}
              </ElTree>
            </>
          )
        }
      }
    }
  },
  {
    field: 'field11',
    component: 'Divider',
    label: t('role.dataScope')
  },

  {
    field: 'data_scope',
    component: 'Select',
    label: t('role.dataScope'),
    componentProps: {
      options: data_scope_values,
      on: {
        change: dataScopeChange
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}
const handleCheckChange = (data: any, checked: any) => {
  const node = unref(treeMenuRef)
    ?.store._getAllNodes()
    .find((node) => node.data.$treeNodeId === data.$treeNodeId)
  if (checked) {
    updateParentChecked(node)
  } else {
    uncheckChildren(node)
  }
}
const updateParentChecked = (node) => {
  let parent = node.parent
  while (parent) {
    parent.checked = true
    parent = parent.parent
  }
}
const uncheckChildren = (node) => {
  node.childNodes?.forEach((child) => {
    child.checked = false
    uncheckChildren(child)
  })
}
const rules = reactive({
  roleName: [required()],
  role: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, delSchema, addSchema } = formMethods

const treeData = ref([])
const treeDeptData = ref([])

// 展开
const handleMenuExpand = (v: boolean) => {
  const nodes = unref(treeMenuRef)?.store._getAllNodes()
  for (let i in nodes) {
    nodes[i].expanded = v
  }
}
// 全选 全不选
const handleMenuNodeAll = (v: boolean) => {
  if (v) {
    const checked: any[] = []
    eachTree(treeData.value, (v) => {
      checked.push({
        id: v.id
      })
    })
    for (const item of checked) {
      unref(treeMenuRef)?.setChecked(item.id, true, false)
    }
  } else {
    unref(treeMenuRef)?.setCheckedKeys([])
  }
}

const getMenuList = async () => {
  const res = await GetMenuList()
  if (res) {
    treeData.value = res.data
    if (!props.currentRow) return
    await nextTick()

    const menus = await get_role_menus_api({ role_id: props.currentRow.role_id })

    if (menus) {
      const checked: any[] = []
      eachTree(menus.data, (v) => {
        checked.push({
          id: v.id
        })
      })
      for (const item of checked) {
        unref(treeMenuRef)?.setChecked(item.id, true, false)
      }
    }
  }
}
getMenuList()

const DeptChange = (v: CheckboxValueType, c: string) => {
  if (c === '1') {
    handleDeptExpand(v as boolean)
  }
  if (c === '2') {
    handleDeptNodeAll(v as boolean)
  }
}
// 展开
const handleDeptExpand = (v: boolean) => {
  const nodes = unref(treeDeptRef)?.store._getAllNodes()
  for (let i in nodes) {
    nodes[i].expanded = v
  }
}
// 全选 全不选
const handleDeptNodeAll = (v: boolean) => {
  if (v) {
    const checked: any[] = []
    eachTree(treeDeptData.value, (v) => {
      checked.push({
        dept_id: v.dept_id
      })
    })
    for (const item of checked) {
      unref(treeDeptRef)?.setChecked(item.dept_id, true, false)
    }
  } else {
    unref(treeDeptRef)?.setCheckedKeys([])
  }
}
const getDeptList = async () => {
  const res = await GetDeptTree()
  if (res) {
    treeDeptData.value = res.data.list
    await nextTick()
    const depts = await get_role_depts({ role_id: props.currentRow.role_id })
    if (depts) {
      const checked: any[] = []
      eachTree(depts.data, (v) => {
        checked.push({
          dept_id: v.dept_id
        })
      })
      for (const item of checked) {
        unref(treeDeptRef)?.setChecked(item.dept_id, true, false)
      }
    }
  }
}

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.data_depts = unref(treeDeptRef)?.getCheckedKeys() || []
    formData.menu = unref(treeMenuRef)?.getCheckedKeys() || []
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    dataScopeChange(currentRow.data_scope)
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
