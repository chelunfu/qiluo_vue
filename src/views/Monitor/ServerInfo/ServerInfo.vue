<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Echart } from '@/components/Echart'
import { ElRow, ElCol, ElCard } from 'element-plus'
import { EChartsOption } from 'echarts'
import { ServerInfoApi, useSSE } from '@/api/serverinfo'
import { ref, watch, reactive } from 'vue'
const { t } = useI18n()

const twocolum = reactive<TableColumn[]>([
  {
    field: 'rowOne',
    type: 'input',
    label: t('monitor.property')
  },
  {
    field: 'rowTwo',
    type: 'input',
    label: t('monitor.system')
  }
])

const threecolum = reactive<TableColumn[]>([
  {
    field: 'rowOne',
    type: 'input',
    label: t('monitor.property')
  },
  {
    field: 'rowTwo',
    type: 'input',
    label: t('monitor.memory')
  },
  {
    field: 'rowThree',
    type: 'input',
    label: t('monitor.system')
  }
])

const fivecolum = reactive<TableColumn[]>([
  {
    field: 'rowOne',
    type: 'input',
    label: t('monitor.networkname')
  },
  {
    field: 'rowTwo',
    type: 'input',
    label: t('monitor.networkreceive')
  },
  {
    field: 'rowThree',
    type: 'input',
    label: t('monitor.networktotalreceive')
  },
  {
    field: 'rowFour',
    type: 'input',
    label: t('monitor.networksend')
  },
  {
    field: 'rowFive',
    type: 'input',
    label: t('monitor.networktotalsend')
  }
])

const { data } = useSSE(ServerInfoApi.server_update)
const cpuData = ref()
const memoryData = ref()
const serverData = ref()
const programData = ref()
const netData = ref()
const cpuGauge = ref<EChartsOption>({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%'
      },
      data: [
        {
          value: 0,
          name: t('monitor.CPU')
        }
      ]
    }
  ]
})

const memoryGauge = ref<EChartsOption>({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%'
      },
      data: [
        {
          value: 0,
          name: t('monitor.memory')
        }
      ]
    }
  ]
})

const setServerData = (data: any) => {
  const cpuUsage = parseFloat(data.cpu.total_use!.toFixed(2))
  const memoryUsage = parseFloat(
    ((100 * data.memory.used_memory!) / data.memory.total_memory!).toFixed(2)
  )
  cpuGauge.value.series![0].data[0].value = cpuUsage
  memoryGauge.value.series![0].data[0].value = memoryUsage
  cpuData.value = [
    {
      rowOne: t('monitor.cores'),
      rowTwo: data.cpu.cores
    },
    {
      rowOne: t('monitor.processors'),
      rowTwo: data.cpu.processors
    },
    {
      rowOne: t('monitor.cpuUsage'),
      rowTwo: cpuUsage + '%'
    },
    {
      rowOne: 'Load Avg 5',
      rowTwo: data.cpu_load.five.toFixed(2) + '%'
    },
    {
      rowOne: 'Load Avg 15',
      rowTwo: data.cpu_load.fifteen.toFixed(2) + '%'
    }
  ]

  memoryData.value = [
    {
      rowOne: t('monitor.total'),
      rowTwo: memoryFormat(data.memory.total_memory)
    },
    {
      rowOne: t('monitor.used'),
      rowTwo: memoryFormat(data.memory.used_memory),
      rowThree: memoryFormat(data.process.used_memory)
    },
    {
      rowOne: t('monitor.swap'),
      rowTwo: memoryFormat(data.memory.total_swap)
    },
    {
      rowOne: t('monitor.usedSwap'),
      rowTwo: memoryFormat(data.memory.used_swap),
      rowThree: memoryFormat(data.process.used_virtual_memory)
    },
    {
      rowOne: t('monitor.usage'),
      rowTwo: memoryUsage + '%',
      rowThree: ((100 * data.process.used_memory!) / data.memory.total_memory!).toFixed(4) + '%'
    }
  ]

  serverData.value = [
    {
      rowOne: t('monitor.servername'),
      rowTwo: data.server.host_name
    },
    {
      rowOne: 'CPU',
      rowTwo: data.cpu.name
    },
    {
      rowOne: t('monitor.systemarch'),
      rowTwo: data.cpu.arch
    },
    {
      rowOne: t('monitor.system'),
      rowTwo: data.server.oper_sys_name
    },
    {
      rowOne: t('monitor.systemversion'),
      rowTwo: data.server.system_version
    },
    {
      rowOne: t('monitor.systemkernel'),
      rowTwo: data.server.system_kerne
    }
  ]

  programData.value = [
    {
      rowOne: t('monitor.softname'),
      rowTwo: data.process.name
    },
    {
      rowOne: t('monitor.softstarttime'),
      rowTwo: new Date(data.process.start_time! * 1000).toLocaleString()
    },
    {
      rowOne: t('monitor.softruntime'),
      rowTwo: timeFormat2DHMS(data.process.run_time!)
    },
    {
      rowOne: t('monitor.cpuUsage'),
      rowTwo: (data.process.cup_usage! / data.cpu.processors!).toFixed(4) + '%'
    },
    {
      rowOne: t('monitor.diskread'),
      rowTwo: memoryFormat(data.process.disk_usage.total_read_bytes!)
    },
    {
      rowOne: t('monitor.diskwrite'),
      rowTwo: memoryFormat(data.process.disk_usage.total_written_bytes!)
    }
  ]

  const netDataV: any[] = []
  data.network.forEach((v) => {
    const item = {
      rowOne: v.name,
      rowTwo: memoryFormat(v.received),
      rowThree: memoryFormat(v.total_received),
      rowFour: memoryFormat(v.transmitted),
      rowFive: memoryFormat(v.total_transmitted)
    }
    netDataV.push(item)
  })
  netData.value = netDataV
}

const memoryFormat = (size: any) => {
  size = parseFloat(size)
  let rank = 0
  let rankChar = 'Bytes'
  while (size > 1024 && rankChar != 'GB') {
    size = size / 1024
    rank++
    if (rank === 1) {
      rankChar = 'KB'
    } else if (rank === 2) {
      rankChar = 'MB'
    } else if (rank === 3) {
      rankChar = 'GB'
    }
  }
  return size.toFixed(2) + ' ' + rankChar
}

const timeFormat2DHMS = (sec: any) => {
  sec = parseInt(sec)
  let day = parseInt((sec / (24 * 3600)).toFixed(1))
  let hour = parseInt(((sec % (24 * 3600)) / 3600).toFixed(1))
  let min = parseInt(((sec % 3600) / 60).toFixed(1))
  let second = parseInt((sec % 60).toFixed(1))
  let res = ''

  if (day > 0) {
    res += day + t('monitor.D')
  }
  if (hour > 0) {
    res += hour + t('monitor.H')
  }
  if (min > 0) {
    res += min + t('monitor.M')
  }
  if (second > 0) {
    res += second + t('monitor.S')
  }
  return res
}

watch(
  () => data.value,
  (v) => setServerData(JSON.parse(v!))
)
</script>

<template>
  <ContentWrap :title="t('monitor.serverinfo')" :message="t('monitor.info')">
    <ElRow :gutter="20" justify="space-between">
      <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <Echart :options="cpuGauge as EChartsOption" :height="400" />
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <Echart :options="memoryGauge as EChartsOption" :height="400" />
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <template #header>
            <div class="flex justify-between">
              <span>CPU</span>
            </div>
          </template>
          <Table :columns="twocolum" :data="cpuData" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <template #header>
            <div class="flex justify-between">
              <span>{{ t('monitor.memory') }}</span>
            </div>
          </template>
          <Table :columns="threecolum" :data="memoryData" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <template #header>
            <div class="flex justify-between">
              <span>{{ t('monitor.serverinfo') }}</span>
            </div>
          </template>
          <Table :columns="twocolum" :data="serverData" />
        </ElCard>
      </ElCol>
      <ElCol :span="12">
        <ElCard shadow="hover" class="mb-20px">
          <template #header>
            <div class="flex justify-between">
              <span>{{ t('monitor.softinfo') }}</span>
            </div>
          </template>
          <Table :columns="twocolum" :data="programData" />
        </ElCard>
      </ElCol>
      <ElCol :span="24">
        <ElCard shadow="hover" class="mb-20px">
          <template #header>
            <div class="flex justify-between">
              <span>{{ t('monitor.network') }}</span>
            </div>
          </template>
          <Table :columns="fivecolum" :data="netData" />
        </ElCard>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>
