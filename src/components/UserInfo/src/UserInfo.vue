<script setup lang="ts">
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElPopover,
  ElRadioGroup,
  ElRow,
  ElCol,
  ElRadio
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import LockDialog from './components/LockDialog.vue'
import { ref, computed } from 'vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { GetUserRoleName } from '@/api/role'
import { GetUserDeptName } from '@/api/department'
import { PostUpdateRoleOrDept } from '@/api/user'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
const { push } = useRouter()
const permissionStore = usePermissionStore()
const userStore = useUserStore()
const role_id = ref('')
const dept_id = ref('')
const buttonRef = ref()
const lockStore = useLockStore()
const roleOptions = ref<any[]>([])
const deptOptions = ref<any[]>([])
const width = ref(0)
const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const loginOut = () => {
  userStore.logoutConfirm()
}

const dialogVisible = ref<boolean>(false)

// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}

const toDocument = () => {
  window.open('https://element-plus-admin-doc.cn/')
}

const toPage = (path: string) => {
  push(path)
}

const refershRoute = async () => {
  await userStore.refersh_router()
  await permissionStore.refersh_permission()

  location.reload()
}
const changeRole = async () => {
  await PostUpdateRoleOrDept({ rid: role_id.value, did: dept_id.value })

  location.reload()
}
const changeDept = async () => {
  await PostUpdateRoleOrDept({ rid: role_id.value, did: dept_id.value })

  location.reload()
}

const get_option = async () => {
  const res = await GetUserRoleName()
  role_id.value = res.data.user_role_id
  roleOptions.value = res.data.roles
  const res2 = await GetUserDeptName()
  dept_id.value = res2.data.user_dept_id
  deptOptions.value = res2.data.depts
}
get_option()
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        :src="userStore.getUserInfo?.avatar || defaultAvatar"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        userStore.getUserInfo?.username
      }}</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="toPage('/personal/personal-center')">
            {{ t('router.personalCenter') }}
          </div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem>

        <ElPopover placement="left-start" :virtual-ref="buttonRef" trigger="hover" :width="150">
          <template #reference>
            <div>
              <ElDropdownItem divided>
                <div>{{ t('common.changerole') }}</div>
              </ElDropdownItem>
            </div>
          </template>
          <ElRadioGroup v-model="role_id" @change="changeRole">
            <ElRow>
              <ElCol v-for="item in roleOptions" :key="item.role_id">
                <ElRadio :value="item.role_id">{{ item.role_name }}</ElRadio>
              </ElCol>
            </ElRow>
          </ElRadioGroup>
        </ElPopover>

        <ElPopover placement="left-start" :virtual-ref="buttonRef" trigger="hover" :width="150">
          <template #reference>
            <div>
              <ElDropdownItem>
                <div>{{ t('common.changedept') }}</div>
              </ElDropdownItem>
            </div>
          </template>
          <ElRadioGroup v-model="dept_id" @change="changeDept">
            <ElRow>
              <ElCol v-for="item in deptOptions" :key="item.dept_id">
                <ElRadio :value="item.dept_id">{{ item.dept_name }}</ElRadio>
              </ElCol>
            </ElRow>
          </ElRadioGroup>
        </ElPopover>

        <ElDropdownItem divided>
          <div @click="refershRoute">{{ t('common.refershroute') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
