<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { useDesign } from '@/hooks/web/useDesign'
import { ElNotification } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()
appStore.$reset()
//localStorage.clear()
const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()

ElNotification({
  title: t('help.tips'),
  type: 'warning',
  duration: 0,
  dangerouslyUseHTMLString: true,
  message:
    '<div>' +
    '<p><strong>' +
    t('help.concise') +
    '</strong></p>' +
    '<p><a href="https://www.qiluo.vip/" target="_blank">' +
    t('help.faq') +
    '</a></p>' +
    '</div>'
})
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{adminNamespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
