<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { Icon } from '@/components/Icon'
import { GetWxMessagesList, GetConversation, ReplyMessage } from '@/api/wechat/wxmessages_api'
import { GetWxAccountsList } from '@/api/wx_accounts'
import { ElMessage, ElImage } from 'element-plus'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUserStoreWithOut } from '@/store/modules/user'
const PATH_URL = import.meta.env.VITE_API_BASE_PATH

const { t } = useI18n()

// 消息类型接口
interface WxMessage {
  id: number | string
  openid: string
  msg_type: string
  content: string
  msg_title: string
  direction: number
  created_at: string
  pic_url?: string
  link_url?: string
  msg_description?: string
  recognition?: string
  event_type?: string
  event_key?: string
  is_auto_reply?: number
  media_id?: string
  voice_format?: string
  thumb_media_id?: string
  location_x?: number
  location_y?: number
  scale?: number
  label?: string
}

// 公众号列表
const accountList = ref<any[]>([])
const selectedAccountId = ref<number | null>(null)

// 会话列表（按 openid 分组，显示最后一条消息）
interface ConversationItem {
  openid: string
  lastContent: string
  lastTime: string
  direction: number
  msgType: string
  unreadCount: number
}
const conversationList = ref<ConversationItem[]>([])
const selectedOpenid = ref('')
const loading = ref(false)

// 聊天消息列表
const chatMessages = ref<WxMessage[]>([])
const chatLoading = ref(false)

// 回复
const replyText = ref('')
const replyLoading = ref(false)

// SSE（实时消息）
let eventSource: EventSource | null = null
let sseRetryTimer: ReturnType<typeof setTimeout> | null = null
let sseRetryCount = 0
const SSE_MAX_RETRY = 5
const SSE_RETRY_DELAY = 5000
const SSE_RETRY_DELAY_MAX = 30000
// 标记组件是否已卸载，防止卸载后 SSE 重连
let isUnmounted = false

// 滚动容器
const chatContainer = ref<HTMLDivElement>()

// 搜索关键词
const searchKeyword = ref('')

// 过滤后的会话列表
const filteredConversationList = computed(() => {
  if (!searchKeyword.value.trim()) return conversationList.value
  const kw = searchKeyword.value.trim().toLowerCase()
  return conversationList.value.filter(
    (conv) => conv.openid.toLowerCase().includes(kw) || conv.lastContent.toLowerCase().includes(kw)
  )
})

// 加载公众号列表
const loadAccounts = async () => {
  const res = await GetWxAccountsList({ page_num: 1, page_size: 100 })
  accountList.value = res.data.list || []
  if (accountList.value.length > 0 && !selectedAccountId.value) {
    selectedAccountId.value = accountList.value[0].id
  }
}

// 加载会话列表（从消息列表中按 openid 分组）
const loadConversations = async () => {
  if (!selectedAccountId.value) return
  loading.value = true
  try {
    const res = await GetWxMessagesList({
      page_num: 1,
      page_size: 500,
      account_id: selectedAccountId.value
    })
    const messages: WxMessage[] = res.data.list || []

    // 按 openid 分组，取每个用户最后一条消息
    const map = new Map<string, ConversationItem>()
    for (const msg of messages) {
      const existing = map.get(msg.openid)
      const msgTime = msg.created_at || ''
      // 只在消息更新时才覆盖
      if (!existing || new Date(msgTime).getTime() > new Date(existing.lastTime).getTime()) {
        map.set(msg.openid, {
          openid: msg.openid,
          lastContent: msg.content || msg.msg_title || `[${msg.msg_type}]`,
          lastTime: msgTime,
          direction: msg.direction,
          msgType: msg.msg_type,
          unreadCount: existing?.unreadCount || 0
        })
      }
    }
    conversationList.value = Array.from(map.values()).sort(
      (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    )
  } finally {
    loading.value = false
  }
}

// 按时间升序排序消息（聊天窗口从上到下：旧→新）
const sortMessages = (msgs: WxMessage[]): WxMessage[] => {
  return [...msgs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

// 加载某个 openid 的聊天记录
const loadChat = async (openid: string) => {
  if (!selectedAccountId.value) return
  chatLoading.value = true
  try {
    const res = await GetConversation({
      account_id: selectedAccountId.value,
      openid
    })
    chatMessages.value = sortMessages(res.data || [])
    // 标记该会话已读
    const conv = conversationList.value.find((c) => c.openid === openid)
    if (conv) conv.unreadCount = 0
    await nextTick()
    scrollToBottom(true)
  } finally {
    chatLoading.value = false
  }
}

// 发送回复
const sendReply = async () => {
  if (!replyText.value.trim()) return
  if (!selectedAccountId.value || !selectedOpenid.value) return

  replyLoading.value = true
  try {
    await ReplyMessage({
      account_id: selectedAccountId.value,
      openid: selectedOpenid.value,
      msg_type: 'text',
      content: replyText.value
    })
    replyText.value = ''
    ElMessage.success(t('wx_messages.reply_success'))
    await loadChat(selectedOpenid.value)
    await loadConversations()
  } catch (e: any) {
    ElMessage.error(e.message || t('wx_messages.reply_failed'))
  } finally {
    replyLoading.value = false
  }
}

// 选中某个会话
const selectConversation = (openid: string) => {
  selectedOpenid.value = openid
  loadChat(openid)
}

// 切换公众号
watch(selectedAccountId, () => {
  selectedOpenid.value = ''
  chatMessages.value = []
  conversationList.value = []
  searchKeyword.value = ''
  loadConversations()
  startSSE()
})

// 判断用户是否在聊天底部附近
const isNearBottom = () => {
  if (!chatContainer.value) return true
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  // 距底部 100px 以内视为"在底部"
  return scrollHeight - scrollTop - clientHeight < 100
}

// 自动滚动到底部（force: 强制滚动，否则仅在用户已在底部时滚动）
const scrollToBottom = (force = false) => {
  if (!chatContainer.value) return
  if (!force && !isNearBottom()) return
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  if (isYesterday) {
    return '昨天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return (
    d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  )
}

// 判断两条消息是否需要显示日期分割线
const shouldShowDateDivider = (currentMsg: WxMessage, prevMsg: WxMessage | null) => {
  if (!prevMsg) return true
  const curr = new Date(currentMsg.created_at)
  const prev = new Date(prevMsg.created_at)
  // 不是同一天
  return curr.toDateString() !== prev.toDateString()
}

// 格式化日期分割线文本
const formatDateDivider = (time: string) => {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()
  if (isToday) return '今天'
  if (isYesterday) return '昨天'
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 获取消息内容显示
const getMessageContent = (msg: WxMessage) => {
  if (msg.msg_type === 'text') return msg.content || ''
  if (msg.msg_type === 'image') return `[${t('wx_messages.msg_type_image')}]`
  if (msg.msg_type === 'voice')
    return msg.recognition
      ? `[${t('wx_messages.msg_type_voice')}] ${msg.recognition}`
      : `[${t('wx_messages.msg_type_voice')}]`
  if (msg.msg_type === 'video') return `[${t('wx_messages.msg_type_video')}]`
  if (msg.msg_type === 'shortvideo') return `[短视频]`
  if (msg.msg_type === 'link')
    return `[${t('wx_messages.msg_type_link')}] ${msg.msg_title || msg.link_url || ''}`
  if (msg.msg_type === 'event')
    return `[${t('wx_messages.msg_type_event')}] ${msg.event_type || ''}${msg.event_key ? ' - ' + msg.event_key : ''}`
  if (msg.msg_type === 'location')
    return `[${t('wx_messages.msg_type_location')}]${msg.label ? ' ' + msg.label : ''}`
  if (msg.msg_type === 'music') return `[音乐] ${msg.msg_title || ''}`
  if (msg.msg_type === 'news') return `[图文] ${msg.msg_title || ''}`
  return `[${msg.msg_type}]`
}

// 微信图片代理：
// 1. mmbiz.qpic.cn 的 URL → 后端代理（绕过防盗链）
// 2. 其他 URL（如本地 http://localhost:5001/static/...）→ 直接使用
const proxyImageUrl = (url: string | undefined | null): string => {
  if (!url) return ''
  if (url.includes('mmbiz.qpic.cn')) {
    return `/api/wechat/wxmessages/proxy_image?url=${encodeURIComponent(url)}`
  }
  return url
}

// 智能截断 openid 显示
const truncateOpenid = (openid: string) => {
  if (openid.length <= 16) return openid
  return openid.substring(0, 8) + '...' + openid.substring(openid.length - 6)
}

// SSE 相关
const startSSE = () => {
  // 关闭旧连接
  stopSSE()
  if (!selectedAccountId.value) return

  const userStore = useUserStoreWithOut()
  // 安全求最大 id
  const maxId =
    chatMessages.value.length > 0
      ? chatMessages.value.reduce((max, m) => Math.max(max, Number(m.id)), 0)
      : 0

  const url = `${PATH_URL}/wechat/wxmessages/stream?account_id=${selectedAccountId.value}&last_id=${maxId}`
  const es = new EventSourcePolyfill(url, {
    headers: {
      ['Authorization']: userStore.getTokenType + ' ' + userStore.getToken
    }
  })
  eventSource = es

  es.addEventListener('new_messages', (e: MessageEvent) => {
    try {
      const newMsgs: WxMessage[] = JSON.parse(e.data)
      if (newMsgs.length > 0) {
        // 更新聊天记录
        if (selectedOpenid.value) {
          const openidMsgs = newMsgs.filter((m) => m.openid === selectedOpenid.value)
          if (openidMsgs.length > 0) {
            // 去重后合并，再按时间排序
            const existingIds = new Set(chatMessages.value.map((m) => String(m.id)))
            const deduped = openidMsgs.filter((m) => !existingIds.has(String(m.id)))
            if (deduped.length > 0) {
              chatMessages.value = sortMessages([...chatMessages.value, ...deduped])
              nextTick(() => scrollToBottom())
            }
          }
        }
        // 更新未读计数（非当前选中会话的新消息）
        for (const msg of newMsgs) {
          if (msg.openid !== selectedOpenid.value && msg.direction === 1) {
            const conv = conversationList.value.find((c) => c.openid === msg.openid)
            if (conv) {
              conv.unreadCount = (conv.unreadCount || 0) + 1
            }
          }
        }
        // SSE 连接成功，重置重试计数
        sseRetryCount = 0
        loadConversations()
      }
    } catch {
      /* ignore parse errors */
    }
  })

  es.onerror = () => {
    // 组件已卸载，不再重连
    if (isUnmounted) return
    // 超过最大重试次数
    if (sseRetryCount >= SSE_MAX_RETRY) {
      console.warn(`SSE 连接重试已达上限 (${SSE_MAX_RETRY})，停止重连`)
      return
    }
    sseRetryCount++
    // 指数退避：5s, 10s, 20s, 30s, 30s...
    const delay = Math.min(SSE_RETRY_DELAY * Math.pow(2, sseRetryCount - 1), SSE_RETRY_DELAY_MAX)
    sseRetryTimer = setTimeout(() => {
      if (!isUnmounted) startSSE()
    }, delay)
  }
}

const stopSSE = () => {
  if (sseRetryTimer) {
    clearTimeout(sseRetryTimer)
    sseRetryTimer = null
  }
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

onMounted(() => {
  isUnmounted = false
  loadAccounts()
})

onUnmounted(() => {
  isUnmounted = true
  stopSSE()
})
</script>

<template>
  <ContentWrap>
    <div class="wx-messages-container">
      <!-- 左侧：公众号选择 + 会话列表 -->
      <div class="conversation-sidebar">
        <div class="sidebar-header">
          <el-select
            v-model="selectedAccountId"
            :placeholder="t('wx_messages.select_account')"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.account_name"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-model="searchKeyword"
            :placeholder="t('wx_messages.search_placeholder') || '搜索会话...'"
            clearable
            prefix-icon="ep:search"
            style="width: 100%; margin-top: 8px"
          />
        </div>
        <div class="conversation-list" v-loading="loading">
          <div
            v-for="conv in filteredConversationList"
            :key="conv.openid"
            class="conversation-item"
            :class="{ active: selectedOpenid === conv.openid }"
            @click="selectConversation(conv.openid)"
          >
            <div class="conv-avatar">
              <Icon icon="ep:user" :size="20" />
            </div>
            <div class="conv-info">
              <div class="conv-top">
                <span class="conv-openid" :title="conv.openid">{{
                  truncateOpenid(conv.openid)
                }}</span>
                <span class="conv-time">{{ formatTime(conv.lastTime) }}</span>
              </div>
              <div class="conv-preview">
                <span v-if="conv.direction === 2" class="conv-send-tag"
                  >[{{ t('wx_messages.direction_send') }}]</span
                >
                {{ conv.lastContent }}
              </div>
            </div>
            <span v-if="conv.unreadCount > 0" class="conv-unread-badge">{{
              conv.unreadCount > 99 ? '99+' : conv.unreadCount
            }}</span>
          </div>
          <div v-if="conversationList.length === 0 && !loading" class="empty-tip">
            {{ t('wx_messages.no_conversation') }}
          </div>
          <div
            v-if="filteredConversationList.length === 0 && conversationList.length > 0"
            class="empty-tip"
          >
            {{ t('wx_messages.no_search_result') || '未找到匹配会话' }}
          </div>
        </div>
      </div>

      <!-- 右侧：聊天区域 -->
      <div class="chat-area">
        <template v-if="selectedOpenid">
          <div class="chat-header">
            <span class="chat-title">{{ selectedOpenid }}</span>
          </div>
          <div class="chat-messages" ref="chatContainer" v-loading="chatLoading">
            <template v-for="(msg, index) in chatMessages" :key="msg.id">
              <!-- 日期分割线 -->
              <div
                v-if="shouldShowDateDivider(msg, index > 0 ? chatMessages[index - 1] : null)"
                class="date-divider"
              >
                <span class="date-divider-text">{{ formatDateDivider(msg.created_at) }}</span>
              </div>
              <div class="chat-msg" :class="msg.direction === 1 ? 'msg-received' : 'msg-sent'">
                <div class="msg-bubble">
                  <div v-if="msg.msg_type === 'image' && msg.pic_url" class="msg-image">
                    <el-image
                      :src="proxyImageUrl(msg.pic_url)"
                      fit="cover"
                      :preview-src-list="[proxyImageUrl(msg.pic_url)]"
                      style="width: 200px; height: 200px; border-radius: 4px"
                    />
                  </div>
                  <div
                    v-else-if="msg.msg_type === 'video' || msg.msg_type === 'shortvideo'"
                    class="msg-video"
                  >
                    <div class="unsupported-hint">
                      <Icon icon="ep:video-play" :size="24" />
                      <span>{{ getMessageContent(msg) }}</span>
                    </div>
                  </div>
                  <div v-else-if="msg.msg_type === 'voice'" class="msg-voice">
                    <Icon icon="ep:microphone" :size="16" />
                    <span class="voice-text">{{ getMessageContent(msg) }}</span>
                  </div>
                  <div v-else-if="msg.msg_type === 'link'" class="msg-link">
                    <div class="link-title">{{ msg.msg_title }}</div>
                    <div class="link-desc">{{ msg.msg_description }}</div>
                    <a :href="msg.link_url" target="_blank" class="link-url">{{ msg.link_url }}</a>
                  </div>
                  <div v-else-if="msg.msg_type === 'location'" class="msg-location">
                    <Icon icon="ep:location" :size="16" />
                    <span>{{ getMessageContent(msg) }}</span>
                  </div>
                  <div v-else-if="msg.msg_type === 'music'" class="msg-music">
                    <Icon icon="ep:headset" :size="16" />
                    <span>{{ getMessageContent(msg) }}</span>
                  </div>
                  <div v-else-if="msg.msg_type === 'news'" class="msg-news">
                    <Icon icon="ep:document" :size="16" />
                    <span>{{ getMessageContent(msg) }}</span>
                  </div>
                  <div v-else class="msg-text">
                    {{ getMessageContent(msg) }}
                  </div>
                  <div class="msg-meta">
                    <span class="msg-time">{{ formatTime(msg.created_at) }}</span>
                    <span v-if="msg.is_auto_reply === 1" class="auto-reply-tag">{{
                      t('wx_messages.is_auto_reply_yes')
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="chatMessages.length === 0 && !chatLoading" class="empty-tip">
              {{ t('wx_messages.no_messages') }}
            </div>
          </div>
          <!-- 回复输入框 -->
          <div class="chat-input-area">
            <textarea
              v-model="replyText"
              :placeholder="t('wx_messages.reply_placeholder')"
              rows="3"
              class="chat-textarea"
              @keydown.enter.ctrl="sendReply"
            ></textarea>
            <div class="input-actions">
              <el-button
                type="primary"
                :loading="replyLoading"
                :disabled="!replyText.trim()"
                @click="sendReply"
              >
                {{ t('wx_messages.send') }}
              </el-button>
              <span class="input-hint">{{ t('wx_messages.ctrl_enter_hint') }}</span>
            </div>
          </div>
        </template>
        <div v-else class="chat-placeholder">
          <Icon icon="ep:chat-dot-round" :size="64" color="#c0c4cc" />
          <p>{{ t('wx_messages.select_conversation') }}</p>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<style scoped>
.wx-messages-container {
  display: flex;
  height: calc(100vh - 200px);
  min-height: 500px;
  border: 1px solid var(--el-border-color-lighter, #e4e7ed);
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-bg-color, #fff);
}

.conversation-sidebar {
  width: 320px;
  min-width: 280px;
  border-right: 1px solid var(--el-border-color-lighter, #e4e7ed);
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color, #fff);
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter, #e4e7ed);
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-extra-light, #f0f0f0);
  transition: background 0.2s;
  position: relative;
}

.conversation-item:hover {
  background: var(--el-fill-color-light, #f5f7fa);
}

.conversation-item.active {
  background: var(--el-color-primary-light-9, #ecf5ff);
}

.conv-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--el-fill-color, #e4e7ed);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  color: var(--el-text-color-secondary, #909399);
}

.conv-info {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-openid {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary, #303133);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-time {
  font-size: 12px;
  color: var(--el-text-color-secondary, #909399);
  flex-shrink: 0;
  margin-left: 8px;
}

.conv-preview {
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-send-tag {
  color: var(--el-color-primary, #409eff);
  margin-right: 4px;
}

.conv-unread-badge {
  position: absolute;
  top: 8px;
  right: 12px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--el-color-danger, #f56c6c);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  padding: 0 5px;
  box-sizing: border-box;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--el-fill-color-lighter, #f5f7fa);
  min-width: 0;
}

.chat-header {
  padding: 12px 20px;
  background: var(--el-bg-color, #fff);
  border-bottom: 1px solid var(--el-border-color-lighter, #e4e7ed);
}

.chat-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary, #303133);
  word-break: break-all;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.date-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
}

.date-divider-text {
  font-size: 12px;
  color: var(--el-text-color-secondary, #909399);
  background: var(--el-fill-color-lighter, #f5f7fa);
  padding: 2px 12px;
  border-radius: 10px;
}

.chat-msg {
  margin-bottom: 16px;
  display: flex;
}

.msg-received {
  justify-content: flex-start;
}

.msg-sent {
  justify-content: flex-end;
}

.msg-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  position: relative;
  word-break: break-word;
}

.msg-received .msg-bubble {
  background: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-lighter, #e4e7ed);
  border-top-left-radius: 4px;
}

.msg-sent .msg-bubble {
  background: var(--el-color-primary-light-5, #95ec69);
  color: var(--el-color-white, #303133);
  border-top-right-radius: 4px;
}

/* 暗色主题适配 */
:root[data-theme='dark'] .msg-sent .msg-bubble,
.dark .msg-sent .msg-bubble {
  background: var(--el-color-primary, #409eff);
  color: #fff;
}

.msg-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.msg-image {
  line-height: 0;
}

.msg-image-fallback {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  padding: 4px 0;
}

.msg-voice {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.msg-video {
  .unsupported-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    padding: 4px 0;
  }
}

.msg-location,
.msg-music,
.msg-news {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.voice-text {
  white-space: pre-wrap;
}

.msg-link {
  font-size: 14px;
}

.link-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.link-desc {
  color: var(--el-text-color-secondary, #909399);
  font-size: 13px;
  margin-bottom: 4px;
}

.link-url {
  color: var(--el-color-primary, #409eff);
  font-size: 12px;
  word-break: break-all;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.msg-time {
  font-size: 11px;
  color: var(--el-text-color-secondary, #909399);
}

.auto-reply-tag {
  font-size: 11px;
  color: var(--el-color-warning, #e6a23c);
  background: var(--el-color-warning-light-9, #fdf6ec);
  padding: 1px 6px;
  border-radius: 3px;
}

.chat-input-area {
  padding: 12px 20px;
  background: var(--el-bg-color, #fff);
  border-top: 1px solid var(--el-border-color-lighter, #e4e7ed);
}

.chat-textarea {
  width: 100%;
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
  background: var(--el-bg-color, #fff);
  color: var(--el-text-color-primary, #303133);
}

.chat-textarea:focus {
  border-color: var(--el-color-primary, #409eff);
}

.chat-textarea::placeholder {
  color: var(--el-text-color-placeholder, #c0c4cc);
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 12px;
}

.input-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary, #909399);
}

.chat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder, #c0c4cc);
}

.chat-placeholder p {
  margin-top: 16px;
  font-size: 14px;
}

.empty-tip {
  text-align: center;
  padding: 40px 20px;
  color: var(--el-text-color-secondary, #909399);
  font-size: 14px;
}

/* 滚动条样式 */
.conversation-list::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.conversation-list::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--el-border-color, #c0c4cc);
  border-radius: 3px;
}

.conversation-list::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
</style>
