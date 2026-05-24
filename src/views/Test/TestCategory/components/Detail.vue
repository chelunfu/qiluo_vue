<script setup lang="ts">
import { PropType } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElImage } from 'element-plus'
import { formatToDateTime } from '@/utils/dateUtil'

const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})
</script>

<template>
  <div v-if="currentRow" class="detail-container">
    <div class="detail-grid">
      <div class="detail-item">
        <span class="label">{{ t('menuuser.id') }}</span>
        <span class="value">{{ currentRow.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.name') }}</span>
        <span class="value">{{ currentRow.name }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.description') }}</span>
        <span class="value">{{ currentRow.description }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.sort') }}</span>
        <span class="value">{{ currentRow.sort }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.status') }}</span>
        <span class="value">{{ currentRow.status }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.cover') }}</span>
        <span class="value">
          <ElImage
            v-if="currentRow.cover"
            style="width: 100px; height: 100px; border-radius: 4px"
            :src="currentRow.cover"
            fit="cover"
          />
          <span v-else>-</span>
        </span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.is_active') }}</span>
        <span class="value">{{ currentRow.is_active }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.weight') }}</span>
        <span class="value">{{ currentRow.weight }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.view_count') }}</span>
        <span class="value">{{ currentRow.view_count }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.created_at') }}</span>
        <span class="value">{{ formatToDateTime(currentRow.created_at) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('menuuser.updated_at') }}</span>
        <span class="value">{{ formatToDateTime(currentRow.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 10px 0;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 0;
}
.detail-item .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.detail-item .value {
  font-size: 14px;
  color: #333;
  word-break: break-all;
}
</style>
