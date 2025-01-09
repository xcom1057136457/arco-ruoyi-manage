<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import viewDialog from './components/viewDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { cleanOperlog, delOperlog, list } from '@/api/monitor/operlog'
import { useDict } from '@/utils/dict'
import { download } from '@/utils/request'

defineOptions({
  name: 'Operlog',
})

const route = useRoute()

const { startLoading, endLoading } = useLoadingStore()

const { sys_oper_type, sys_common_status } = useDict(
  'sys_oper_type',
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
      label: '系统模块',
      field: 'title',
      type: 'a-input',
    },
    {
      label: '操作类型',
      field: 'businessType',
      type: 'a-select',
      dictData: sys_oper_type.value,
    },
    {
      label: '操作人员',
      field: 'operName',
      type: 'a-input',
    },
    {
      label: '操作状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_common_status.value,
    },
    {
      label: '操作日期',
      field: 'operTime',
      type: 'a-range-picker',
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '日志编号',
    dataIndex: 'operId',
  },
  {
    title: '系统模块',
    dataIndex: 'title',
  },
  {
    title: '操作类型',
    dataIndex: 'businessType',
    slotName: 'businessType',
  },
  {
    title: '操作人员',
    dataIndex: 'operName',
  },
  {
    title: '主机',
    dataIndex: 'operIp',
  },
  {
    title: '操作状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '操作日期',
    dataIndex: 'operTime',
  },
  {
    title: '消耗时间',
    dataIndex: 'costTime',
    slotName: 'costTime',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
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
    }: any = await list({
      ...searchParams.value,
      ...pageParams.value,
      params: {
        beginTime:
          searchParams.value.operTime && searchParams.value.operTime.length
            ? searchParams.value.operTime[0]
            : '',
        endTime:
          searchParams.value.operTime && searchParams.value.operTime.length
            ? searchParams.value.operTime[1]
            : '',
      },
      operTime: '',
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

// 批量删除
function handleDelete(cellItem?: any) {
  const operIds = cellItem?.operId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除日志编号为${operIds}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delOperlog(operIds)
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
    '/monitor/operlog/export',
    {
      ...searchParams.value,
      params: {
        beginTime:
          searchParams.value.operTime && searchParams.value.operTime.length
            ? searchParams.value.operTime[0]
            : '',
        endTime:
          searchParams.value.operTime && searchParams.value.operTime.length
            ? searchParams.value.operTime[1]
            : '',
      },
      operTime: '',
    },
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}

// 清空
function handleClear() {
  Modal.confirm({
    title: '系统通知',
    content: '是否清空数据?',
    async onOk() {
      const { code }: any = await cleanOperlog()
      if (code === 200) {
        Message.success('清空成功!')
        await loadData()
      }
    },
  })
}

// 详情
const viewShow = ref(false)

const viewDetail = ref({})

function handleView(cellItem: any) {
  viewShow.value = true
  nextTick(() => {
    viewDetail.value = cellItem
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
    row-key="operId"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['monitor:operlog:remove']"
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
        v-has-permi="['monitor:operlog:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button
        v-has-permi="['monitor:operlog:remove']"
        status="danger"
        @click="handleClear"
      >
        <template #icon>
          <icon-poweroff />
        </template>
        清空
      </a-button>
    </template>

    <template #businessType="{ record }">
      <dict-tag :value="record.businessType" :options="sys_oper_type" />
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_common_status" />
    </template>

    <template #costTime="{ record }">
      {{ `${record.costTime} 毫秒` }}
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link
          v-has-permi="['monitor:operlog:query']"
          @click="handleView(record)"
        >
          <template #icon>
            <icon-eye />
          </template>
          详细
        </a-link>

        <a-link
          v-has-permi="['monitor:operlog:remove']"
          status="danger"
          @click="handleDelete(record)"
        >
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-link>
      </div>
    </template>
  </crud-table>

  <view-dialog
    v-model:visible="viewShow"
    :view-detail="viewDetail"
    :sys-oper-type="sys_oper_type"
  />
</template>

<style scoped lang="scss"></style>
