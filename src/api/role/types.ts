import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

export interface RoleEditReq {
  role_id: number
  role_name: string
  role_key: string
  order: number
  status: string
  menu_ids: number[]
}

export const data_scope_values = [
  {
    value: '1',
    label: t('role.all')
  },
  {
    value: '5',
    label: t('role.self')
  },
  {
    value: '3',
    label: t('role.dept')
  },
  {
    value: '4',
    label: t('role.deptdown')
  },
  {
    value: '2',
    label: t('role.custom')
  }
]
