<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  cleanLogininfor,
  delLogininfor,
  list,
  unlockLogininfor,
} from '@/api/monitor/logininfor'
import { download } from '@/utils/request'

defineOptions({
  name: 'Logininfor',
})

const route = useRoute()

const { sys_common_status } = useDict('sys_common_status')

const { startLoading, endLoading } = useLoadingStore()

const selectedKeys = ref<any>([])

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
      label: '用户名称',
      field: 'userName',
      type: 'a-input',
    },
    {
      label: '登录地址',
      field: 'ipaddr',
      type: 'a-input',
    },
    {
      label: '登录状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_common_status.value,
    },
    {
      label: '访问时间',
      field: 'loginTime',
      type: 'a-range-picker',
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '访问编号',
    dataIndex: 'infoId',
    minWidth: 100,
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    sortable: {
      sortDirections: ['descend', 'ascend'],
      sorter: true,
    },
    minWidth: 120,
  },
  {
    title: '登录地址',
    dataIndex: 'ipaddr',
    minWidth: 150,
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    minWidth: 150,
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    minWidth: 160,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    minWidth: 140,
  },
  {
    title: '登录状态',
    dataIndex: 'status',
    slotName: 'status',
    minWidth: 100,
  },
  {
    title: '描述',
    dataIndex: 'msg',
    minWidth: 220,
  },
  {
    title: '访问时间',
    dataIndex: 'loginTime',
    sortable: {
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: true,
    },
    width: 200,
  },
])

const tableData = ref<any[]>([])

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
          searchParams.value.loginTime && searchParams.value.loginTime.length
            ? searchParams.value.loginTime[0]
            : '',
        endTime:
          searchParams.value.loginTime && searchParams.value.loginTime.length
            ? searchParams.value.loginTime[1]
            : '',
      },
      loginTime: '',
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

// 排序
function handleSortChange(dataIndex: string, direction: string) {
  searchParams.value.orderByColumn = dataIndex
  searchParams.value.isAsc = direction ? `${direction}ing` : ''
  loadData()
}

// 删除
async function handleDelete() {
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除访问编号为${selectedKeys.value}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delLogininfor(selectedKeys.value)
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
    '/monitor/logininfor/export',
    {
      ...searchParams.value,
      params: {
        beginTime:
          searchParams.value.loginTime && searchParams.value.loginTime.length
            ? searchParams.value.loginTime[0]
            : '',
        endTime:
          searchParams.value.loginTime && searchParams.value.loginTime.length
            ? searchParams.value.loginTime[1]
            : '',
      },
      loginTime: '',
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
      const { code }: any = await cleanLogininfor()
      if (code === 200) {
        Message.success('清空数据成功!')
        await loadData()
      }
    },
  })
}

// 解锁
function handleUnLock() {
  const username
    = tableData.value.find((item: any) => item.infoId === selectedKeys.value[0])
      ?.userName ?? ''
  Modal.confirm({
    title: '系统通知',
    content: `是否确认解锁用户${username}数据项?`,
    async onOk() {
      const { code }: any = await unlockLogininfor(username)
      if (code === 200) {
        Message.success('解锁成功!')
        selectedKeys.value = []
        await loadData()
      }
    },
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
    row-key="infoId"
    :total
    :search-columns="searchColumns"
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    @sort-change="handleSortChange"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['monitor:logininfor:remove']"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleDelete"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>

      <a-button
        v-has-permi="['monitor:logininfor:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button
        v-has-permi="['monitor:logininfor:remove']"
        status="danger"
        @click="handleClear"
      >
        <template #icon>
          <icon-poweroff />
        </template>
        清空
      </a-button>

      <a-button
        v-has-permi="['monitor:logininfor:unlock']"
        status="normal"
        :disabled="selectedKeys.length !== 1"
        @click="handleUnLock"
      >
        <template #icon>
          <icon-unlock />
        </template>
        解锁
      </a-button>
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_common_status" />
    </template>
  </crud-table>
</template>

<style scoped lang="scss"></style>
