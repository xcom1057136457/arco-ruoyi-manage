<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import operateDialog from './components/operateDialog.vue'
import jobDetailDialog from './components/jobDetailDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  addJob,
  changeJobStatus,
  delJob,
  getJob,
  listJob,
  runJob,
  updateJob,
} from '@/api/monitor/job'
import { download } from '@/utils/request'

defineOptions({
  name: 'Job',
})

const route = useRoute()

const router = useRouter()

const { startLoading, endLoading } = useLoadingStore()

const { sys_job_group, sys_job_status } = useDict(
  'sys_job_group',
  'sys_job_status',
)

const selectedKeys = ref([])

const searchParams = ref({})

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
      label: '任务状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_job_status.value,
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '任务编号',
    dataIndex: 'jobId',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    width: 230,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '任务组名',
    dataIndex: 'jobGroup',
    slotName: 'jobGroup',
    width: 100,
  },
  {
    title: '调用目标字符串',
    dataIndex: 'invokeTarget',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'cron执行表达式',
    dataIndex: 'cronExpression',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 80,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
    width: 230,
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
    }: any = await listJob({ ...searchParams.value, ...pageParams.value })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

// 状态切换
function handleStatusChange(cellItem: any) {
  const text = cellItem.status === '0' ? '启用' : '停用'
  Modal.confirm({
    title: '系统通知',
    content: `确认要${text}${cellItem?.jobName}任务吗?`,
    async onOk() {
      try {
        const { code }: any = await changeJobStatus(
          cellItem?.jobId,
          cellItem?.status,
        )
        if (code === 200) {
          Message.success(`${text}成功`)
          await loadData()
        }
      }
      catch (e) {
        cellItem.status = cellItem.status === '0' ? '1' : '0'
      }
    },
    onCancel() {
      cellItem.status = cellItem.status === '0' ? '1' : '0'
    },
  })
}

const operateShow = ref(false)

const rowId = ref('')

const OperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.jobId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getJob(rowId.value)
    if (code === 200) {
      OperateDialogRef.value.formParams = data
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateJob : addJob
  try {
    const { code }: any = await func({ ...formParams, jobId: rowId.value })
    if (code === 200) {
      Message.success(rowId.value ? '修改成功!' : '新增成功!')
      done()
      operateShow.value = false
      await loadData()
    }
  }
  catch (e) {
    done()
  }
}

// 删除
function handleDelete(cellItem?: any) {
  const jobIds = cellItem?.jobId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除定时任务编号为${jobIds}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delJob(jobIds)
      if (code === 200) {
        Message.success('删除成功!')
        await loadData()
      }
    },
  })
}

// 导出
async function handleExport() {
  startLoading('下载中...')
  await download(
    '/monitor/job/export',
    searchParams.value,
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}

// 日志
function handleViewLog(cellItem?: any) {
  const jobId = cellItem?.jobId || 0
  router.push({
    name: 'JobLog',
    params: {
      jobId,
    },
  })
}

// 执行一次
function handleRun(cellItem: any) {
  Modal.confirm({
    title: '系统通知',
    content: `确认要立即执行一次${cellItem?.jobName}任务吗?`,
    async onOk() {
      const { code }: any = await runJob(cellItem?.jobId, cellItem?.jobGroup)
      if (code === 200) {
        Message.success('执行成功!')
        await loadData()
      }
    },
  })
}

// 任务详情
const detailShow = ref(false)

const JobDetailDialogRef = shallowRef()

function handleViewDetail(cellItem: any) {
  detailShow.value = true
  nextTick(() => {
    JobDetailDialogRef.value.loadDetailInfo(cellItem?.jobId)
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
    row-key="jobId"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    :scroll="{ x: 1600 }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['monitor:job:add']"
        status="success"
        @click="handleAdd"
      >
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>

      <a-button
        v-has-permi="['monitor:job:remove']"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleDelete()"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>

      <a-button
        v-has-permi="['monitor:job:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button v-has-permi="['monitor:job:query']" @click="handleViewLog">
        <template #icon>
          <icon-list />
        </template>
        日志
      </a-button>
    </template>

    <template #status="{ record }">
      <a-switch
        v-model="record.status"
        checked-value="0"
        unchecked-value="1"
        @change="handleStatusChange(record)"
      />
    </template>

    <template #jobGroup="{ record }">
      <dict-tag :value="record.jobGroup" :options="sys_job_group" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link v-has-permi="['monitor:job:edit']" @click="handleEdit(record)">
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['monitor:job:remove']"
          status="danger"
          @click="handleDelete(record)"
        >
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-link>

        <a-dropdown trigger="hover">
          <a-link
            v-has-permi="['monitor:job:changeStatus', 'monitor:job:query']"
            status="success"
          >
            <template #icon>
              <icon-more />
            </template>
            更多
          </a-link>

          <template #content>
            <a-doption
              v-has-permi="['monitor:job:changeStatus']"
              @click="handleRun(record)"
            >
              <template #icon>
                <icon-play-arrow-fill />
              </template>
              执行一次
            </a-doption>

            <a-doption
              v-has-permi="['monitor:job:query']"
              @click="handleViewDetail(record)"
            >
              <template #icon>
                <icon-eye />
              </template>
              任务详情
            </a-doption>

            <a-doption
              v-has-permi="['monitor:job:query']"
              @click="handleViewLog(record)"
            >
              <template #icon>
                <icon-list />
              </template>
              调度日志
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </template>
  </crud-table>

  <operate-dialog
    ref="OperateDialogRef"
    v-model:visible="operateShow"
    :row-id="rowId"
    :sys-job-group="sys_job_group"
    :sys-job-status="sys_job_status"
    @submit="handleSubmit"
  />

  <job-detail-dialog ref="JobDetailDialogRef" v-model:visible="detailShow" />
</template>

<style scoped lang="scss"></style>
