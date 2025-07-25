<template>
  <div>
    <ElForm>
      <ElFormItem>
        <ElRadio v-model="groupV" :label="DayGroup.EVERY" :key="cronTypeV + DayGroup.EVERY + ''">
          <span class="font-bold">
            {{ t('vueCron.t.week') }}
          </span>
          <span class="m-l-10px"> {{ t('vueCron.allowed') }} [ , - * ? / L #] </span>
        </ElRadio>
      </ElFormItem>
      <ElFormItem>
        <ElRadio
          v-model="groupV"
          :label="DayGroup.NOT_SPECIFY"
          :key="cronTypeV + DayGroup.NOT_SPECIFY + ''"
        >
          <span class="font-bold">
            {{ t('vueCron.t.notSpecify') }}
          </span>
        </ElRadio>
      </ElFormItem>
      <ElFormItem>
        <ElRadio v-model="groupV" :label="DayGroup.CYCLE" :key="cronTypeV + DayGroup.CYCLE + ''">
          <span class="font-bold"> {{ t('vueCron.second.cycle') }} </span>
          <span class="m-l-10px">
            {{ t('vueCron.from') }}
            <el-select v-model="cycle.from" class="m-10px w-120px" placeholder="Select">
              <el-option v-for="i in 7" :key="i" :label="t(`vueCron.week.${i}`)" :value="i" />
            </el-select>
          </span>
          {{ t('vueCron.to') }}
          <el-select v-model="cycle.to" class="m-10px w-120px" placeholder="Select">
            <el-option
              v-for="i in 7"
              :key="i"
              :label="t(`vueCron.week.${i}`)"
              :value="i"
              :disabled="i < cycle.from"
            />
          </el-select>
        </ElRadio>
      </ElFormItem>
      <ElFormItem>
        <ElRadio
          v-model="groupV"
          :label="DayGroup.LAST_WEEK_DAY"
          :key="cronTypeV + DayGroup.LAST_WEEK_DAY + ''"
        >
          <span class="font-bold">
            {{ t('vueCron.t.lastWeekDay') }}
          </span>
          <el-select v-model="cycle.lastWeekDay" class="m-10px w-120px" placeholder="Select">
            <el-option v-for="i in 7" :key="i" :label="t(`vueCron.week.${i}`)" :value="i" />
          </el-select>
        </ElRadio>
      </ElFormItem>
      <ElFormItem>
        <ElRadio
          v-model="groupV"
          :label="DayGroup.FIX_MONTH_WEEK"
          :key="cronTypeV + DayGroup.FIX_MONTH_WEEK + ''"
        >
          <span class="font-bold"> {{ t('vueCron.second.fixWeek') }} </span>
          <span class="m-l-10px">
            {{ t('vueCron.t.month') }}
            <ElInputNumber v-model="cycle.fromWeek" :min="1" :max="4" class="w-120px" />
          </span>
          {{ t('vueCron.weekTitle') }}

          <el-select v-model="cycle.every" class="m-10px w-120px" placeholder="Select">
            <el-option v-for="i in 7" :key="i" :label="t(`vueCron.week.${i}`)" :value="i" />
          </el-select>
          {{ t('vueCron.runOneTime') }}
        </ElRadio>
      </ElFormItem>
      <ElFormItem>
        <ElCol>
          <ElRow>
            <ElRadio v-model="groupV" :label="DayGroup.FIX" :key="cronTypeV + DayGroup.FIX + ''">
              <span class="font-bold">{{ t('vueCron.second.fix') }}</span>
              <ElButton round type="warning" class="m-l-30px" @click="() => (fixData = [])">
                {{ t('vueCron.resetCheckBox') }}
              </ElButton>
            </ElRadio>
          </ElRow>
          <ElRow class="m-l-30px">
            <ElCheckboxGroup v-model="fixData" @change="fixDataChange(fixData)">
              <ElCol>
                <ElRow>
                  <ElCheckbox style="margin-right: 10px" v-for="i in 7" :key="i" :label="i">
                    {{ t(`vueCron.week.${i}`) }}
                  </ElCheckbox>
                </ElRow>
              </ElCol>
            </ElCheckboxGroup>
          </ElRow>
        </ElCol>
      </ElFormItem>
    </ElForm>
  </div>
</template>
<script lang="ts" setup name="vue-cron-week">
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElCol,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRow,
  ElSelect
} from 'element-plus'
import { type PropType, ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { CronType, DayGroup } from '../types'

const props = defineProps({
  cronTypeV: {
    type: Number as PropType<CronType>,
    required: true
  }
})
const cycle = ref({
  from: 1,
  fromWeek: 1,
  lastWeekDay: 1,
  to: 3,
  every: 1
})
const emits = defineEmits(['setCronData'])
const groupV = ref(DayGroup.EVERY)
const fixData = ref([])
const fixDataString = ref('')

const fixDataChange = (v: string[]) => {
  groupV.value = DayGroup.FIX
  if (v.length === 0) return
  const data = v.sort()
  fixDataString.value = data.map((x) => parseInt(x)).join(',')
}
// 监控cycle的变化
watch(
  () => cycle.value,
  (v) => {
    if (v.from >= v.to) {
      cycle.value.to = cycle.value.from + 1 <= 7 ? cycle.value.from : 7
    }
    if (v.from + v.every >= 7) {
      cycle.value.every = 6 - cycle.value.from
    }
  },
  { deep: true }
)
// 监控相关值的变化，生成表达式,并提交给父组件
watch(
  [fixDataString, () => cycle.value, groupV],
  () => {
    switch (groupV.value) {
      case DayGroup.EVERY:
        emits('setCronData', props.cronTypeV, '*')
        break
      case DayGroup.NOT_SPECIFY:
        emits('setCronData', props.cronTypeV, '?')
        break
      case DayGroup.CYCLE: {
        const data = cycle.value.from + '-' + cycle.value.to
        emits('setCronData', props.cronTypeV, data)
        break
      }
      case DayGroup.FIX_MONTH_WEEK: {
        const data = cycle.value.fromWeek + '#' + cycle.value.every
        emits('setCronData', props.cronTypeV, data)
        break
      }
      case DayGroup.LAST_WEEK_DAY: {
        const data = cycle.value.lastWeekDay + 'L'
        emits('setCronData', props.cronTypeV, data)
        break
      }
      case DayGroup.FIX:
        emits('setCronData', props.cronTypeV, fixDataString.value)
        break
    }
  },
  { deep: true }
)
</script>
