<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { forceLogout, list } from '@/api/monitor/online'

defineOptions({
  name: 'Online',
})

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
      label: '登录名称',
      field: 'userName',
      type: 'a-input',
    },
    {
      label: '主机',
      field: 'ipaddr',
      type: 'a-input',
    },

  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
    width: 80,
  },
  {
    title: '会话编号',
    dataIndex: 'tokenId',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '登录名称',
    dataIndex: 'userName',
    width: 130,
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 230,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '主机',
    dataIndex: 'ipaddr',
    width: 150,
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    width: 100,
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 120,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    width: 140,
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 180,
    slotName: 'loginTime',
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
    const { code, rows, total: totalData }: any = await list({ ...searchParams.value, ...pageParams.value })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

// 强退
function handleForceLogout(cellItem: any) {
  Modal.confirm({
    title: '系统通知',
    content: `是否确认强退名称${cellItem?.userName}的用户?`,
    async onOk() {
      const { code }: any = await forceLogout(cellItem?.tokenId)
      if (code === 200) {
        Message.success('强退成功!')
        await loadData()
      }
    },
  })
}
</script>

<template>
  <crud-table
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:table-columns="tableColumns"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :pagination-load="false"
    :scroll="{ x: 1600 }"
    @load-data="loadData"
  >
    <template #index="{ rowIndex }">
      {{ rowIndex + 1 }}
    </template>

    <template #loginTime="{ record }">
      {{ dayjs(record.loginTime).format('YYYY-MM-DD HH:mm:ss') }}
    </template>

    <template #operate="{ record }">
      <a-link v-has-permi="['monitor:online:forceLogout']" status="danger" @click="handleForceLogout(record)">
        <template #icon>
          <icon-poweroff />
        </template>
        强退
      </a-link>
    </template>
  </crud-table>
</template>

<style scoped lang="scss"></style>
