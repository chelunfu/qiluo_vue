export interface MenuAdd {
  pid: string
  path: string | null
  redirect: string | null
  name: string
  menu_type: string
  component: string | null
  status: string
  remark: string | null
  order: number
  api: string
  method: string
  hidden: boolean
  alwaysShow: boolean
  title: string
  icon: string
  noCache: boolean
  breadcrumb: boolean
  affix: boolean
  activeMenu: boolean
  noTagsView: boolean
  canTo: boolean
}
