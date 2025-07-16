import { defineStore } from 'pinia'
import { store } from '../index'
import { UserLoginType, UserTokenType, UserInfoType } from '@/api/login/types'
//import {}
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useTagsViewStore } from './tagsView'
import router from '@/router'
import { GetAdminRole } from '@/api/login'
import { PutRefershToken, GetLoginOut } from '@/api/user'
interface UserState {
  userToken?: UserTokenType
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType
  userInfo?: UserInfoType
  refershtoken: Boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userToken: undefined,
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
      userInfo: undefined,
      refershtoken: false
    }
  },
  getters: {
    getTokenInfo(): UserTokenType | undefined {
      return this.userToken
    },
    getTokenType(): string {
      if (this.userToken) {
        return this.userToken.token_type
      }
      return ''
    },
    getToken(): string {
      if (this.userToken) {
        return this.userToken.token
      }
      return ''
    },
    getUserInfo(): UserInfoType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      console.log('getRoleRouters')
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    }
  },
  actions: {
    setUserToken(userToken?: UserTokenType) {
      this.userToken = userToken
    },
    setUserInfo(userInfo?: any) {
      this.userInfo = userInfo
    },
    setUserAvatar(avatar: string) {
      this.userInfo!.avatar = avatar
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await GetLoginOut().catch(() => {})
          console.log(res)
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    reset() {
      console.log('reset')
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setUserToken(undefined)
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    },
    async refersh_router() {
      console.log('刷新路由')

      const res = await GetAdminRole()
      if (res) {
        const routers = res.data || []
        this.setRoleRouters(routers)
      }
    },
    async freshToken() {
      console.log('刷新Token')
      this.refershtoken = true
      const res = await PutRefershToken()
      if (res) {
        this.setUserToken(res.data)
      }
      this.refershtoken = false
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}

export const userToken = () => {
  const userStore = useUserStore()
  const now = new Date().getTime() / 1000 //分钟
  const exp =
    (userStore.getTokenInfo === undefined ? now : userStore.getTokenInfo!.exp - now) /
    (24 * 60 * 60) // 天
  const isExpiredSoon = exp < 1
  const valid = exp > 0
  const refershtoken = userStore.refershtoken
  return {
    isExpiredSoon,
    valid,
    refershtoken
  }
}
