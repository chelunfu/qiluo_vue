// stores/captcha.ts
import { defineStore } from 'pinia'
import { GetCaptcha } from '@/api/login'
export const useCaptchaStore = defineStore('captcha', {
  state: () => ({
    clientId: '', // 客户端唯一ID
    captchaData: null as any, // 验证码数据
    loading: false
  }),

  actions: {
    // 生成新的客户端ID
    generateClientId() {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 9)
      this.clientId = `captcha_${timestamp}_${random}`
      return this.clientId
    },

    // 获取验证码
    async getCaptcha() {
      this.loading = true
      try {
        // 每次获取验证码时生成新的ID
        const newClientId = this.generateClientId()

        const response = await GetCaptcha({ client_id: newClientId })

        this.captchaData = response.data
        return response
      } catch (error) {
        console.error('获取验证码失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 刷新验证码（生成新ID）
    async refreshCaptcha() {
      return await this.getCaptcha()
    }
  }
})
