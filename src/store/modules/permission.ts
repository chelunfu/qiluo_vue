import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { role_permission_list } from '@/api/roleapi'
export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
  permissions: string[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
    permissions: []
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    async refersh_permission() {
      console.log('刷新权限')

      const res = await role_permission_list()
      if (res) {
        const permissions = res.data || []
        this.setPermissions(permissions)
      }
    },
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          //routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 直接读取静态路由表
          // routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters', 'permissions']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
