<script lang="ts" setup>
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElMessage,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs
} from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { CronType } from './types'
import { PostValidateCron } from '@/api/job'

import Day from './pages/day.vue'
import Hour from './pages/hour.vue'
import Month from './pages/month.vue'
import SecondOrMinute from './pages/second-or-minute.vue'
import Week from './pages/week.vue'
import Year from './pages/year.vue'

interface cronTable {
  id: string
  second?: string
  minute?: string
  hour?: string
  day?: string
  month?: string
  week?: string
  year?: string
}
interface SpanMethodProps {
  rowIndex: number
  columnIndex: number
}

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['closeDialog', 'setCronExp'])
const activeTab = ref('second')
const cronArray = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
const cronData = ref<cronTable>({
  id: t('vueCron.expressionField'),
  second: '*',
  minute: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
  year: ''
})
const cronExpression = ref<cronTable>({
  id: t('vueCron.expression'),
  second: '* * * * * ?'
})
const valid = ref(false)
const validType = ref<'success' | 'warning' | 'info' | 'error'>('info')
const validTip = ref(t('vueCron.validateTipInfo'))
const next_ten = ref<string[]>([])

watch(
  () => cronData.value,
  (x) => {
    cronExpression.value.second = cronArray
      .map((v) => x[v as keyof cronTable])
      .join(' ')
      .trim()
    valid.value = false
    validType.value = 'info'
    validTip.value = t('vueCron.validateTipInfo')
    next_ten.value = []
  },
  { deep: true }
)

const tableData = ref<cronTable[]>([cronData.value, cronExpression.value])

const arraySpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (rowIndex === 1) {
    if (columnIndex === 0) {
      return [1, 1]
    } else if (columnIndex === 1) {
      return [1, 7]
    }
  }
}
const setCronData = (cronType: CronType, v: string) => {
  switch (cronType) {
    case CronType.SECOND:
      cronData.value.second = v
      break
    case CronType.MINUTE:
      cronData.value.minute = v
      break
    case CronType.HOUR:
      cronData.value.hour = v
      break
    case CronType.DAY:
      cronData.value.day = v
      break
    case CronType.MONTH:
      cronData.value.month = v
      break
    case CronType.WEEK:
      cronData.value.week = v
      break
    case CronType.YEAR:
      cronData.value.year = v
      break
  }
}
const cancel = () => {
  emits('closeDialog')
}

const PostValidateCronClick = async () => {
  valid.value = false
  const data = await PostValidateCron({ cron_expression: cronExpression.value.second })
  console.log(data)
  validType.value = 'info'
  validTip.value = t('vueCron.validateTipInfo')

  if (!data.data.validate) {
    validType.value = 'error'
    validTip.value = t('vueCron.validateTipError')
    return
  }
  validType.value = 'success'
  valid.value = true
  validTip.value = t('vueCron.validateTipSuccess')
  next_ten.value = data.data.next_ten!
}
const submitForm = () => {
  if (!valid.value) return ElMessage.info(t('vueCron.validateTip'))
  emits('setCronExp', cronExpression.value.second)
  cancel()
}
</script>

<template>
  <ElDialog
    :model-value="open"
    :before-close="cancel"
    :title="t('vueCron.title')"
    append-to-body
    width="830px"
  >
    <ElTabs v-model="activeTab" class="cronTabs">
      <ElTabPane :label="t('vueCron.secondTitle')" name="second">
        <SecondOrMinute :cron-type-v="CronType.SECOND" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.minuteTitle')" name="minute">
        <SecondOrMinute :cron-type-v="CronType.MINUTE" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.hourTitle')" name="hour">
        <Hour :cron-type-v="CronType.HOUR" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.dayTitle')" name="day">
        <Day :cron-type-v="CronType.DAY" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.monthTitle')" name="month">
        <Month :cron-type-v="CronType.MONTH" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.weekTitle')" name="week">
        <Week :cron-type-v="CronType.WEEK" @set-cron-data="setCronData" />
      </ElTabPane>
      <ElTabPane :label="t('vueCron.yearTitle')" name="year">
        <Year :cron-type-v="CronType.YEAR" @set-cron-data="setCronData" />
      </ElTabPane>
    </ElTabs>
    <ElTable
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      tooltip-effect="light"
      style="width: 100%"
    >
      <ElTableColumn prop="id" label="#" align="center" width="130" />
      <ElTableColumn
        prop="second"
        :label="t('vueCron.secondTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="minute"
        :label="t('vueCron.minuteTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="hour"
        :label="t('vueCron.hourTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="day"
        :label="t('vueCron.dayTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="month"
        :label="t('vueCron.monthTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="week"
        :label="t('vueCron.weekTitle')"
        align="center"
        show-overflow-tooltip
      />
      <ElTableColumn
        prop="year"
        :label="t('vueCron.yearTitle')"
        align="center"
        show-overflow-tooltip
      />
    </ElTable>
    <ElCard class="m-t-10px cronCard">
      <template #header>
        <div>
          <span>{{ t('vueCron.nextruntime') }}</span>
        </div>
      </template>
      <ElCol>
        <ElRow v-for="i in 3" :key="i">
          <div v-for="j in 4" :key="i + '' + j" :class="j !== 4 ? 'm-r-50px' : ''">
            {{ next_ten[(i - 1) * 4 + (j - 1)] }}
          </div>
        </ElRow>
      </ElCol>
    </ElCard>
    <div class="m-t-10px">
      <ElAlert :title="validTip" :type="validType" show-icon :closable="false" />
    </div>
    <template #footer>
      <div class="flex justify-center">
        <ElButton type="warning" @click="PostValidateCronClick">
          {{ t('common.validate') }}
        </ElButton>
        <ElButton type="primary" @click="submitForm">
          {{ t('common.submit') }}
        </ElButton>
        <ElButton @click="cancel">
          {{ t('common.cancel') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less">
.cronCard {
  .el-card__header {
    padding-bottom: 5px !important;
    padding-top: 5px !important;
  }
  .el-card__body {
    padding-bottom: 5px !important;
    padding-top: 5px !important;
  }
}
.cronTabs {
  .el-form {
    .el-form-item--default {
      margin-bottom: 10px !important;
    }
    .el-form-item--small {
      margin-bottom: 10px !important;
    }
    .el-form-item--large {
      margin-bottom: 10px !important;
    }
  }
}
</style>
