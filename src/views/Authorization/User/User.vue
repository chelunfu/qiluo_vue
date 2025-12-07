<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Form, FormSchema } from '@/components/Form'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree, ElInput, ElDivider } from 'element-plus'
import { GetDeptTree } from '@/api/department'
import { useValidator } from '@/hooks/web/useValidator'
const { required } = useValidator()
import {
  PutUserEdit,
  PostUserAdd,
  GetUserList,
  GetDeptsRoles,
  PutChagePassword,
  DelUsers,
  ApiUser
} from '@/api/user'
import { hasPermi } from '@/components/Permission'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { ElTag, ElTooltip } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useForm } from '@/hooks/web/useForm'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    const { page_size, page_num } = tableState
    const res = await GetUserList({
      dept_id: unref(currentNodeKey),
      page_num: unref(page_num),
      page_size: unref(page_size),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await DelUsers(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, page_size, page_num } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('menuuser.index'),
    type: 'index'
  },
  {
    field: 'user_name',
    label: t('menuuser.username')
  },
  {
    field: 'nick_name',
    label: t('menuuser.nickname')
  },
  {
    field: 'dept_name',
    label: t('menuuser.role')
  },
  {
    field: 'role_name',
    label: t('menuuser.role')
  },
  {
    field: 'email',
    label: t('menuuser.email')
  },
  {
    field: 'phonenumber',
    label: t('menuuser.phone')
  },
  {
    field: 'sex',
    label: t('menuuser.sex'),
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <span>
            {row.sex === '2'
              ? t('menuuser.unknown')
              : row.sex === '1'
                ? t('menuuser.male')
                : t('menuuser.female')}
          </span>
        )
      }
    }
  },
  {
    field: 'status',
    label: t('menuuser.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === '0' ? 'success' : 'danger'}>
              {data.row.status === '0' ? t('menuuser.enable') : t('menuuser.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'created_at',
    label: t('menuuser.createTime')
  },
  {
    field: 'action',
    label: t('menuuser.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <ElTooltip
              v-show={hasPermi(ApiUser.edit)}
              content={t('usertable.edit')}
              placement="bottom"
            >
              <BaseButton size="small" type="primary" onClick={() => action(row, 'edit')}>
                <Icon icon="vi-ant-design:edit-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip content={t('usertable.detail')} placement="bottom">
              <BaseButton size="small" type="success" onClick={() => action(row, 'detail')}>
                <Icon icon="vi-ant-design:file-text-filled" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip
              v-show={hasPermi(ApiUser.changePassword)}
              content={t('menuuser.chagepassword')}
              placement="bottom"
            >
              <BaseButton size="small" type="warning" onClick={() => openChagePassWord(row)}>
                <Icon icon="vi-tdesign:user-password" />
              </BaseButton>
            </ElTooltip>
            <ElTooltip
              v-show={hasPermi(ApiUser.delusers)}
              content={t('usertable.del')}
              placement="bottom"
            >
              <BaseButton size="small" type="danger" onClick={() => delData(row)}>
                <Icon icon="vi-ant-design:delete-filled" />
              </BaseButton>
            </ElTooltip>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'user_name',
    label: t('menuuser.username'),
    component: 'Input'
  },
  {
    field: 'phonenumber',
    label: t('menuuser.phone'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('menuuser.email'),
    component: 'Input'
  }
])
const searchParams = ref({})
const setSearchParams = (params: any) => {
  page_num.value = 1
  searchParams.value = params
  getList()
}
const searchCom = ref<typeof Search>()
const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('0')
const departmentList = ref<any[]>([])
const fetchDepartment = async () => {
  const res = await GetDeptTree()
  departmentList.value = res.data.list
  currentNodeKey.value =
    (res.data.list[0] && res.data.list[0]?.children && res.data.list[0].children[0].dept_id) || '0'

  await nextTick()
  unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}
fetchDepartment()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const currentChange = (data: any) => {
  currentNodeKey.value = data.dept_id
  page_num.value = 1
  unref(searchCom)!.search()
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.dept_name.includes(value)
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('usertable.add')
  actionType.value = 'add'
  currentRow.value = undefined
  currentRow.value = {
    department: departmentList.value,
    dept_ids: [],
    role_ids: []
  }
  dialogVisible.value = true
}
const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = async (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'usertable.edit' : 'usertable.detail')
  actionType.value = type

  const res = await GetDeptsRoles(row.id)
  currentRow.value = {
    ...row,
    department: departmentList.value,
    dept_ids: res.data.depts || [],
    role_ids: res.data.roles || []
  }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true

    if (actionType.value === 'edit') {
      const res = await PutUserEdit(formData)

      if (res) {
        page_num.value = 1
        getList()
      }
    } else if (actionType.value === 'add') {
      const res = await PostUserAdd(formData)
      if (res) {
        page_num.value = 1
        getList()
      }
    }
    saveLoading.value = false
    dialogVisible.value = false
  }
}

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods
const dialogChangePass = ref(false)
const changePassLoading = ref(false)
let uid = ''
const changepassSchema = reactive<FormSchema[]>([
  {
    field: 'new_password',
    label: t('menuuser.newpassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      strength: true
    }
  }
])
const openChagePassWord = async (row: any) => {
  actionType.value = ''
  dialogChangePass.value = true
  uid = row.id
}
const saveChangePassword = async () => {
  changePassLoading.value = true
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((_err) => {})

  if (valid) {
    const formData = await getFormData()
    formData.uid = uid
    const res = await PutChagePassword(formData)
    if (res) {
    }
    changePassLoading.value = false
    dialogChangePass.value = false
  } else {
    changePassLoading.value = false
  }
}

const rules = reactive({
  new_password: [required()]
})
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <div class="flex justify-center items-center">
        <div class="flex-1">{{ t('menuuser.departmentList') }}</div>
        <ElInput
          v-model="currentDepartment"
          class="flex-[2]"
          :placeholder="t('menuuser.searchDepartment')"
          clearable
        />
      </div>
      <ElDivider />
      <ElTree
        ref="treeEl"
        :data="departmentList"
        default-expand-all
        :expand-on-click-node="false"
        node-key="dept_id"
        :current-node-key="currentNodeKey"
        highlight-current
        :props="{
          label: 'dept_name'
        }"
        :filter-node-method="filterNode"
        @current-change="currentChange"
      >
        <template #default="{ data }">
          <div :title="data.dept_name" class="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {{ data.dept_name }}
          </div>
        </template>
      </ElTree>
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <Search
        ref="searchCom"
        :schema="searchSchema"
        button-position="right"
        layout="bottom"
        show-expand
        @reset="setSearchParams"
        @search="setSearchParams"
      />

      <div class="mb-10px">
        <BaseButton v-if="hasPermi(ApiUser.add)" type="primary" @click="AddAction">{{
          t('usertable.add')
        }}</BaseButton>
        <BaseButton
          v-if="hasPermi(ApiUser.delusers)"
          :loading="delLoading"
          type="danger"
          @click="delData()"
        >
          {{ t('usertable.del') }}
        </BaseButton>
      </div>
      <Table
        v-model:current-page="page_num"
        v-model:page-size="page_size"
        :columns="tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>
    <Dialog v-model="dialogChangePass" :title="t('menuuser.chagepassword')">
      <Form :rules="rules" :schema="changepassSchema" @register="formRegister" />
      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="changePassLoading"
          @click="saveChangePassword"
        >
          {{ t('menuuser.chagepassword') }}
        </BaseButton>
        <BaseButton @click="dialogChangePass = false">{{ t('dialog.close') }}</BaseButton>
      </template>
    </Dialog>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :current-row="currentRow"
        :action-type="actionType"
      />

      <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('usertable.save') }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{ t('dialog.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
