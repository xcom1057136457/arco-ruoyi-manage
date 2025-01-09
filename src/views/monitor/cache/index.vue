<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import * as echarts from 'echarts'
import { getCache } from '@/api/monitor/cache'

defineOptions({
  name: 'Cache',
})

const loading = ref(false)

// 加载数据
const cacheInfo = ref<any>({})

const CommandStatistics = shallowRef<HTMLElement>()

const MemoryInfo = shallowRef<HTMLElement>()

async function loadData() {
  loading.value = true
  try {
    const { code, data }: any = await getCache()
    if (code === 200) {
      cacheInfo.value = data

      // 命令统计
      const commandStatisticsInstance = echarts.init(CommandStatistics.value, 'macarons')

      commandStatisticsInstance.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 150],
            center: ['50%', '50%'],
            data: data.commandStats,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
          },
        ],
      })

      // 内存信息
      const memoryInstance = echarts.init(MemoryInfo.value, 'macarons')

      memoryInstance.setOption({
        tooltip: {
          formatter: `{b} <br/>{a} : ${cacheInfo.value?.info?.used_memory_human}`,
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            detail: {
              formatter: cacheInfo.value?.info?.used_memory_human,
            },
            data: [
              {
                value: Number.parseFloat(cacheInfo.value?.info?.used_memory_human),
                name: '内存消耗',
              },
            ],
          },
        ],
      })
    }
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <a-spin :loading dot w-full>
    <div grid="~ cols-2" gap-3>
      <div col-span-2 bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-solar-display-linear text-xl />
          <div text-sm>
            基本信息
          </div>
        </div>

        <div p-3>
          <a-descriptions :column="4" bordered size="large">
            <a-descriptions-item label="Redis版本">
              {{ cacheInfo?.info?.redis_version }}
            </a-descriptions-item>

            <a-descriptions-item label="运行模式">
              {{
                cacheInfo?.info?.redis_mode
                  ? cacheInfo?.info?.redis_mode === "standalone"
                    ? "单机"
                    : "集群"
                  : ""
              }}
            </a-descriptions-item>

            <a-descriptions-item label="端口">
              {{ cacheInfo?.info?.tcp_port }}
            </a-descriptions-item>

            <a-descriptions-item label="客户端数">
              {{ cacheInfo?.info?.connected_clients }}
            </a-descriptions-item>

            <a-descriptions-item label="运行时间(天)">
              {{ cacheInfo?.info?.uptime_in_days }}
            </a-descriptions-item>

            <a-descriptions-item label="使用内存">
              {{ cacheInfo?.info?.used_memory_human }}
            </a-descriptions-item>

            <a-descriptions-item label="使用CPU">
              {{
                cacheInfo?.info?.used_cpu_user_children
                  && parseFloat(cacheInfo?.info?.used_cpu_user_children).toFixed(2)
              }}
            </a-descriptions-item>

            <a-descriptions-item label="内存配置">
              {{ cacheInfo?.info?.maxmemory_human }}
            </a-descriptions-item>

            <a-descriptions-item label="AOF是否开启">
              {{
                cacheInfo?.info?.aof_enabled
                  && cacheInfo?.info?.aof_enabled === "0"
                  ? "否"
                  : "是"
              }}
            </a-descriptions-item>

            <a-descriptions-item label="RDB是否成功">
              {{ cacheInfo?.info?.rdb_last_bgsave_status }}
            </a-descriptions-item>

            <a-descriptions-item label="Key数量">
              {{ cacheInfo?.dbSize }}
            </a-descriptions-item>

            <a-descriptions-item label="网络入口/出口">
              {{
                cacheInfo?.info?.instantaneous_input_kbps
                  && `${cacheInfo?.info?.instantaneous_input_kbps}kps`
                    + ` / ${cacheInfo?.info?.instantaneous_output_kbps}`
              }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-solar-pie-chart-2-bold-duotone text-xl />
          <div text-sm>
            命令统计
          </div>
        </div>

        <div ref="CommandStatistics" h-420px />
      </div>

      <div bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-solar-spedometer-max-bold-duotone text-xl />
          <div text-sm>
            内存信息
          </div>
        </div>

        <div ref="MemoryInfo" h-420px />
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="scss"></style>
