<script setup lang="ts">
import { Error } from '@/components/Error'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const { push } = useRouter()

const permissionStore = usePermissionStore()

const errorClick = () => {
  push(permissionStore.addRouters[0]?.path as string)
}
const quitClick = () => {
  userStore.logoutConfirm()
}
</script>

<template>
  <Error @error-click="errorClick" @quit-click="quitClick" />
</template>
