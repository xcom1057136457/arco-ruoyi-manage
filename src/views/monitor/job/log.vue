<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import logJobDetailDialog from './components/logJobDetailDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import { cleanJobLog, delJobLog, listJobLog } from '@/api/monitor/jobLog'
import { getJob } from '@/api/monitor/job'
import { download } from '@/utils/request'

defineOptions({
  name: 'JobLog',
})

const { startLoading, endLoading } = useLoadingStore()

const { handleCloseCurrent } = useTagViewsStore()

const route = useRoute()

const { sys_job_group, sys_common_status } = useDict(
  'sys_job_group',
  'sys_common_status',
)

const selectedKeys = ref([])

const searchParams = ref<any>({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

const loading = ref(false)

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '任务名称',
      field: 'jobName',
      type: 'a-input',
    },
    {
      label: '任务组名',
      field: 'jobGroup',
      type: 'a-select',
      dictData: sys_job_group.value,
    },
    {
      label: '执行状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_common_status.value,
    },
    {
      label: '执行时间',
      field: 'dateRange',
      type: 'a-range-picker',
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '日志编号',
    dataIndex: 'jobLogId',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    width: 220,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '任务组名',
    dataIndex: 'jobGroup',
    slotName: 'jobGroup',
    width: 150,
  },
  {
    title: '调用目标字符串',
    dataIndex: 'invokeTarget',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '日志信息',
    dataIndex: 'jobMessage',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '执行状态',
    dataIndex: 'status',
    width: 120,
    slotName: 'status',
  },
  {
    title: '执行时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
    width: 100,
    fixed: 'right',
  },
])

const tableData = ref([])

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listJobLog({
      ...searchParams.value,
      ...pageParams.value,
      params: {
        beginTime:
          searchParams.value.dateRange && searchParams.value.dateRange.length
            ? searchParams.value.dateRange[0]
            : '',
        endTime:
          searchParams.value.dateRange && searchParams.value.dateRange.length
            ? searchParams.value.dateRange[1]
            : '',
      },
      dateRange: '',
    })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

async function handleInit() {
  const jobId: any = route.params?.jobId ? Number(route.params?.jobId) : ''
  if (jobId && jobId !== 0) {
    const { code, data }: any = await getJob(jobId)
    if (code === 200) {
      searchParams.value.jobName = data?.jobName
      searchParams.value.jobGroup = data?.jobGroup
      await loadData()
    }
  }
  else {
    await loadData()
  }
}

handleInit()

// 删除
function handleDelete() {
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除调度日志编号为${selectedKeys.value}的数据项?`,
    async onOk() {
      const { code }: any = await delJobLog(selectedKeys.value)
      if (code === 200) {
        Message.success('删除成功!')
        selectedKeys.value = []
        await loadData()
      }
    },
  })
}

// 清空
function handleClear() {
  Modal.confirm({
    title: '系统通知',
    content: '是否清空数据?',
    async onOk() {
      const { code }: any = await cleanJobLog()
      if (code === 200) {
        Message.success('清空成功!')
        selectedKeys.value = []
        await loadData()
      }
    },
  })
}

// 导出
async function handleExport() {
  startLoading('下载中...')
  await download(
    'monitor/jobLog/export',
    {
      ...searchParams.value,
      params: {
        beginTime:
          searchParams.value.dateRange && searchParams.value.dateRange.length
            ? searchParams.value.dateRange[0]
            : '',
        endTime:
          searchParams.value.dateRange && searchParams.value.dateRange.length
            ? searchParams.value.dateRange[1]
            : '',
      },
      dateRange: '',
    },
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}

// 任务详情
const detailShow = ref(false)

const LogJobDetailDialogRef = shallowRef()

function handleViewDetail(cellItem: any) {
  detailShow.value = true
  nextTick(() => {
    LogJobDetailDialogRef.value.detailInfo = cloneDeep(cellItem)
  })
}
</script>

<template>
  <crud-table
    v-model:selected-keys="selectedKeys"
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:table-columns="tableColumns"
    row-key="jobLogId"
    :immediately="false"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    :scroll="{ x: 1700 }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleDelete"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>

      <a-button status="danger" @click="handleClear">
        <template #icon>
          <icon-poweroff />
        </template>
        清空
      </a-button>

      <a-button status="warning" @click="handleExport">
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button @click="() => handleCloseCurrent('/monitor/job')">
        <template #icon>
          <icon-close />
        </template>
        关闭
      </a-button>
    </template>

    <template #jobGroup="{ record }">
      <dict-tag :value="record.jobGroup" :options="sys_job_group" />
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_common_status" />
    </template>

    <template #operate="{ record }">
      <a-link status="warning" @click="handleViewDetail(record)">
        <template #icon>
          <icon-eye />
        </template>
        详情
      </a-link>
    </template>
  </crud-table>

  <log-job-detail-dialog ref="LogJobDetailDialogRef" v-model:visible="detailShow" />
</template>

<style scoped lang="scss"></style>
