<!-- 由 Dioa 创建于 2024-06-07 星期五 -->
<script setup lang="ts">
import {
  Message,
  type TableColumnData,
  type TableData,
} from '@arco-design/web-vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { getAuthRole, updateAuthRole } from '@/api/system/user'
import type { IPageParams } from '@/typings/pageParams'

defineOptions({
  name: 'AuthRole',
})

const route = useRoute()

const { handleCloseCurrent } = useTagViewsStore()

const selectedKeys = ref<any>([])

const loading = ref(false)

const searchColumns = ref<ISearchColumns[]>([
  {
    label: '用户昵称',
    field: 'nickName',
    type: 'a-input',
    disabled: true,
  },
  {
    label: '登录账号',
    field: 'userName',
    type: 'a-input',
    disabled: true,
  },
])

const searchParams = ref({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '角色编号',
    dataIndex: 'roleId',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '权限字符',
    dataIndex: 'roleKey',
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
    const { code, user, roles }: any = await getAuthRole(route.params?.userId)
    if (code === 200) {
      searchParams.value = user
      tableData.value = roles
      total.value = tableData.value.length
      selectedKeys.value = tableData.value
        .filter((item: any) => item.flag)
        .map((item: any) => item.roleId)
    }
  }
  finally {
    loading.value = false
  }
}

// 点击
function handleRowClick(record: TableData) {
  if (selectedKeys.value.includes(record.roleId)) {
    const rowIndex = selectedKeys.value.findIndex(
      (item: any) => item === record.roleId,
    )
    selectedKeys.value.splice(rowIndex, 1)
  }
  else {
    selectedKeys.value.push(record.roleId)
  }
}

// 提交
const submitLoading = ref(false)

async function handleSubmit() {
  submitLoading.value = true
  try {
    const { code }: any = await updateAuthRole({
      userId: route.params?.userId,
      roleIds: selectedKeys.value.join(','),
    })
    if (code === 200) {
      Message.success('授权成功!')
      await loadData()
    }
  }
  finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <crud-table
    v-model:selected-keys="selectedKeys"
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:table-columns="tableColumns"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    row-key="roleId"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    :pagination-load="false"
    @row-click="handleRowClick"
    @load-data="loadData"
  >
    <template #index="{ rowIndex }">
      {{ rowIndex + 1 }}
    </template>
  </crud-table>

  <div p="x-2 y-3" mt-3 flex items-center justify-end gap-x-3 bg-bg-color-2>
    <a-button type="primary" :loading="submitLoading" @click="handleSubmit">
      <template #icon>
        <div i-solar-check-square-broken />
      </template>
      提交
    </a-button>

    <a-button @click="handleCloseCurrent('/system/user')">
      <template #icon>
        <div i-solar-close-square-outline />
      </template>
      关闭
    </a-button>
  </div>
</template>

<style scoped lang="scss"></style>
