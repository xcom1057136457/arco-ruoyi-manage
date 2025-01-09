<!-- 由 Dioa 创建于 2024-06-07 星期五 -->
<script setup lang="ts">
import type { TableColumnData, TableData } from '@arco-design/web-vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import type { IPageParams } from '@/typings/pageParams'
import { unallocatedUserList } from '@/api/system/role'

defineOptions({
  name: 'SelectUserDialog',
})

const props = withDefaults(
  defineProps<{
    sysNormalDisable?: any[]
  }>(),
  {
    sysNormalDisable: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false, type: Boolean })

const route = useRoute()

const selectedKeys = ref<any[]>([])

const loading = ref(false)

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const searchParams = ref({})

const searchColumns = ref<ISearchColumns[]>([
  {
    label: '用户名称',
    field: 'userName',
    type: 'a-input',
  },
  {
    label: '手机号码',
    field: 'phonenumber',
    type: 'a-input',
  },
])

const tableColumns = ref<TableColumnData[]>([
  {
    title: '用户名称',
    dataIndex: 'userName',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号码',
    dataIndex: 'phonenumber',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
])

const tableData = ref([])

const total = ref(0)

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await unallocatedUserList({
      ...searchParams.value,
      ...pageParams.value,
      roleId: route.params?.roleId,
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

// 点击
function handleRowClick(record: TableData) {
  if (selectedKeys.value.includes(record.userId)) {
    const rowIndex = selectedKeys.value.findIndex(
      item => item === record.roleId,
    )
    selectedKeys.value.splice(rowIndex, 1)
  }
  else {
    selectedKeys.value.push(record.userId)
  }
}

// 提交
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true
  emits('submit', selectedKeys.value.join(','), () => {
    submitLoading.value = false
  })
}

// 关闭
function handleClose() {
  submitLoading.value = false
  selectedKeys.value = []
  loading.value = false
  searchParams.value = {}
  pageParams.value.pageNum = 1
  pageParams.value.pageSize = 10
  tableData.value = []
}

defineExpose({
  loadData,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :width="1200"
    title="选择用户"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <crud-table
      v-model:selected-keys="selectedKeys"
      v-model:loading="loading"
      v-model:search-params="searchParams"
      v-model:page-num="pageParams.pageNum"
      v-model:page-size="pageParams.pageSize"
      v-model:table-columns="tableColumns"
      row-key="userId"
      :search-columns="searchColumns"
      :search-columns-span="3"
      :total
      :table-data="tableData"
      :immediately="false"
      :row-selection="{
        type: 'checkbox',
        showCheckedAll: true,
      }"
      @row-click="handleRowClick"
      @load-data="loadData"
    >
      <template #status="{ record }">
        <dict-tag :value="record.status" :options="props.sysNormalDisable" />
      </template>
    </crud-table>

    <template #footer>
      <a-button @click="visible = false">
        取消
      </a-button>
      <a-button
        type="primary"
        :disabled="selectedKeys.length === 0"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        确认
      </a-button>
    </template>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
