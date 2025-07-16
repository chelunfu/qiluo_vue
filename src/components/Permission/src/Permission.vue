<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { computed, unref } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'

const permissionStore = usePermissionStore()
const props = defineProps({
  permission: propTypes.string.def()
})

const currentPermission = computed(() => {
  return unref(permissionStore)?.permissions || []
})

const hasPermission = computed(() => {
  const permission = unref(props.permission)
  if (!permission) {
    return true
  }
  return unref(currentPermission).includes(permission)
})
</script>

<template>
  <template v-if="hasPermission">
    <slot></slot>
  </template>
</template>
