import { useI18n } from '@/hooks/web/useI18n'
import { usePermissionStore } from '@/store/modules/permission'

export const hasPermi = (value: string) => {
  const permissionStore = usePermissionStore()
  const { t } = useI18n()

  if (!value) {
    throw new Error(t('permission.hasPermission'))
  }
  const permission = permissionStore.getPermissions
  if (permission.includes(value)) {
    return true
  }
  return false
}
