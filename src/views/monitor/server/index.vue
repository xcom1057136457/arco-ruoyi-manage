<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import type { IServer } from './types'
import { getServer } from '@/api/monitor/server'

defineOptions({
  name: 'Server',
})

const server = ref<IServer>({
  cpu: {},
  mem: {},
  jvm: {},
  sys: {},
  sysFiles: [],
})

const cpuTableColumns = ref<TableColumnData[]>([
  {
    title: '属性',
    dataIndex: 'attribute',
  },
  {
    title: '值',
    dataIndex: 'value',
  },
])

const cpuTableData = computed(() => {
  return [
    {
      attribute: '核心数',
      value: server.value.cpu?.cpuNum,
    },
    {
      attribute: '用户使用率',
      value:
        server.value.cpu?.used || server.value.cpu?.used === 0
          ? `${server.value.cpu?.used}%`
          : '',
    },
    {
      attribute: '系统使用率',
      value:
        server.value.cpu?.sys || server.value.cpu?.sys === 0
          ? `${server.value.cpu?.sys}%`
          : '',
    },
    {
      attribute: '当前空闲率',
      value:
        server.value.cpu?.free || server.value.cpu?.free === 0
          ? `${server.value.cpu?.free}%`
          : '',
    },
  ]
})

const memoryTableColumns = ref<TableColumnData[]>([
  {
    title: '属性',
    dataIndex: 'attribute',
  },
  {
    title: '内存',
    dataIndex: 'memory',
  },
  {
    title: 'JVM',
    dataIndex: 'jvm',
  },
])

const memoryTableData = computed(() => {
  return [
    {
      attribute: '总内存',
      memory:
        server.value.mem?.total || server.value.mem?.total === 0
          ? `${server.value.mem?.total}G`
          : '',
      jvm:
        server.value.jvm?.total || server.value.jvm?.total === 0
          ? `${server.value.jvm?.total}M`
          : '',
    },
    {
      attribute: '已用内存',
      memory:
        server.value.mem?.used || server.value.mem?.used === 0
          ? `${server.value.mem?.used}G`
          : '',
      jvm:
        server.value.jvm?.used || server.value.jvm?.used === 0
          ? `${server.value.jvm?.used}M`
          : '',
    },
    {
      attribute: '剩余内存',
      memory:
        server.value.mem?.free || server.value.mem?.free === 0
          ? `${server.value.mem?.free}G`
          : '',
      jvm:
        server.value.jvm?.free || server.value.jvm?.free === 0
          ? `${server.value.jvm?.free}M`
          : '',
    },
    {
      attribute: '使用率',
      memory:
        server.value.mem?.usage || server.value.mem?.usage === 0
          ? `${server.value.mem?.usage}%`
          : '',
      jvm:
        server.value.jvm?.usage || server.value.jvm?.usage === 0
          ? `${server.value.jvm?.usage}%`
          : '',
    },
  ]
})

const diskTableColumns = ref<TableColumnData[]>([
  {
    title: '盘符路径',
    dataIndex: 'dirName',
  },
  {
    title: '文件系统',
    dataIndex: 'sysTypeName',
  },
  {
    title: '盘符类型',
    dataIndex: 'typeName',
  },
  {
    title: '总大小',
    dataIndex: 'total',
  },
  {
    title: '可用大小',
    dataIndex: 'free',
  },
  {
    title: '已用大小',
    dataIndex: 'used',
  },
  {
    title: '已用百分比',
    dataIndex: 'usage',
    slotName: 'usage',
  },

])

// 加载数据
const loading = ref(false)

async function loadData() {
  loading.value = true
  try {
    const { code, data }: any = await getServer()
    if (code === 200) {
      server.value = data
    }
  }
  finally {
    loading.value = false
  }
}

loadData()
</script>

<template>
  <a-spin dot w-full :loading>
    <div grid="~ cols-2" gap-3>
      <div bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-solar-cpu-bold text-xl />
          <div text-sm>
            CPU
          </div>
        </div>

        <div p-3>
          <a-table
            :data="cpuTableData"
            :columns="cpuTableColumns"
            :pagination="false"
          />
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
          <div i-solar-spedometer-max-bold-duotone text-xl />
          <div text-sm>
            内存
          </div>
        </div>

        <div p-3>
          <a-table
            :data="memoryTableData"
            :columns="memoryTableColumns"
            :pagination="false"
          />
        </div>
      </div>

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
            服务器信息
          </div>
        </div>

        <div p-3>
          <a-descriptions :column="2" bordered size="large">
            <a-descriptions-item label="服务器名称">
              {{ server.sys.computerName }}
            </a-descriptions-item>

            <a-descriptions-item label="操作系统">
              {{ server.sys.osName }}
            </a-descriptions-item>

            <a-descriptions-item label="服务器IP">
              {{ server.sys.computerIp }}
            </a-descriptions-item>

            <a-descriptions-item label="系统架构">
              {{ server.sys.osArch }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div col-span-2 bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-fa6-brands-java text-xl />
          <div text-sm>
            Java虚拟机信息
          </div>
        </div>

        <div p-3>
          <a-descriptions :column="2" bordered size="large">
            <a-descriptions-item label="Java名称">
              {{ server.jvm.name }}
            </a-descriptions-item>

            <a-descriptions-item label="Java版本">
              {{ server.jvm.version }}
            </a-descriptions-item>

            <a-descriptions-item label="启动时间">
              {{ server.jvm.startTime }}
            </a-descriptions-item>

            <a-descriptions-item label="运行时长">
              {{ server.jvm.runTime }}
            </a-descriptions-item>

            <a-descriptions-item label="安装路径" :span="2">
              {{ server.jvm.home }}
            </a-descriptions-item>

            <a-descriptions-item label="项目路径" :span="2">
              {{ server.sys.userDir }}
            </a-descriptions-item>

            <a-descriptions-item label="运行参数" :span="2">
              {{ server.jvm.inputArgs }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div col-span-2 bg-bg-color-2>
        <div
          flex
          items-center
          gap-x-2
          text="text-color-2"
          p="x-3 y-3"
          border="0 b solid border-color-2"
        >
          <div i-solar-diskette-bold-duotone text-xl />
          <div text-sm>
            磁盘状态
          </div>
        </div>

        <div p-3>
          <a-table :data="server.sysFiles" :columns="diskTableColumns" :pagination="false">
            <template #usage="{ record }">
              {{ record.usage || record.usage === 0 ? `${record.usage}%` : '' }}
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="scss"></style>
