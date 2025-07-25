<script lang="ts" setup>
import { ref } from 'vue'
import { ElInput } from 'element-plus'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { useStorage } from '@/hooks/web/useStorage'
import { useLockStore } from '@/store/modules/lock'
import { useI18n } from '@/hooks/web/useI18n'
import { useNow } from '@/hooks/web/useNow'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@/components/Icon'
import { GetLoginOut } from '@/api/user'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()

const { clear } = useStorage()

const { replace } = useRouter()

const password = ref('')
const loading = ref(false)
const errMsg = ref(false)
const showDate = ref(true)

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('lock-page')

const lockStore = useLockStore()

const { hour, month, minute, meridiem, year, day, week } = useNow(true)

const { t } = useI18n()

// 解锁
async function unLock() {
  if (!password.value) {
    return
  }
  let pwd = password.value
  try {
    loading.value = true
    const res = await lockStore.unLock(pwd)
    errMsg.value = !res
  } finally {
    loading.value = false
  }
}

// 返回登录
async function goLogin() {
  const res = await GetLoginOut().catch(() => {})
  if (res) {
    clear()
    tagsViewStore.delAllViews()
    resetRouter() // 重置静态路由表
    lockStore.resetLockInfo()
    replace('/login')
  }
}

function handleShowForm(show = false) {
  showDate.value = show
}
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed inset-0 flex h-screen w-screen bg-black items-center justify-center"
  >
    <div
      :class="`${prefixCls}__unlock`"
      class="absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2"
      @click="handleShowForm(false)"
      v-show="showDate"
    >
      <Icon icon="vi-ep:lock" />
      <span>{{ t('lock.unlock') }}</span>
    </div>

    <div class="flex w-screen h-screen justify-center items-center">
      <div :class="`${prefixCls}__hour`" class="relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5">
        <span>{{ hour }}</span>
        <span class="meridiem absolute left-5 top-5 text-md xl:text-xl" v-show="showDate">
          {{ meridiem }}
        </span>
      </div>
      <div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
        <span> {{ minute }}</span>
      </div>
    </div>
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div class="flex flex-col items-center">
            <img src="@/assets/imgs/avatar.jpg" alt="" class="w-70px h-70px rounded-[50%]" />
            <span class="text-14px my-10px text-[var(--logo-title-text-color)]">Archer</span>
          </div>
          <ElInput
            type="password"
            :placeholder="t('lock.placeholder')"
            class="enter-x"
            v-model="password"
          />
          <span :class="`text-14px ${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
            {{ t('lock.message') }}
          </span>
          <div :class="`${prefixCls}-entry__footer enter-x`">
            <BaseButton
              type="primary"
              size="small"
              class="mt-2 mr-2 enter-x"
              link
              :disabled="loading"
              @click="handleShowForm(true)"
            >
              {{ t('common.back') }}
            </BaseButton>
            <BaseButton
              type="primary"
              size="small"
              class="mt-2 mr-2 enter-x"
              link
              :disabled="loading"
              @click="goLogin"
            >
              {{ t('lock.backToLogin') }}
            </BaseButton>
            <BaseButton
              type="primary"
              class="mt-2"
              size="small"
              link
              @click="unLock()"
              :disabled="loading"
            >
              {{ t('lock.entrySystem') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </transition>

    <div class="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
      <div class="text-5xl mb-4 enter-x" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
      </div>
      <div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-lock-page';

// Small screen / tablet
@screen-sm: 576px;

// Medium screen / desktop
@screen-md: 768px;

// Large screen / wide desktop
@screen-lg: 992px;

// Extra large screen / full hd
@screen-xl: 1200px;

// Extra extra large screen / large desktop
@screen-2xl: 1600px;

@error-color: #ed6f6f;

.@{prefix-cls} {
  z-index: 3000;

  &__unlock {
    transform: translate(-50%, 0);
  }

  &__hour,
  &__minute {
    display: flex;
    font-weight: 700;
    color: #bababa;
    background-color: #141313;
    border-radius: 30px;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: @screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (min-width: @screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (max-width: @screen-sm) {
      span:not(.meridiem) {
        font-size: 90px;
      }
    }

    @media screen and (min-width: @screen-lg) {
      span:not(.meridiem) {
        font-size: 220px;
      }
    }

    @media screen and (min-width: @screen-xl) {
      span:not(.meridiem) {
        font-size: 260px;
      }
    }

    @media screen and (min-width: @screen-2xl) {
      span:not(.meridiem) {
        font-size: 320px;
      }
    }
  }

  &-entry {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
    backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;

    &-content {
      width: 260px;
    }

    &__header {
      text-align: center;

      &-img {
        width: 70px;
        margin: 0 auto;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
        font-weight: 500;
        color: #bababa;
      }
    }

    &__err-msg {
      display: inline-block;
      margin-top: 10px;
      color: @error-color;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
