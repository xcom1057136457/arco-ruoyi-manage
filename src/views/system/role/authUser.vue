<!-- 由 Dioa 创建于 2024-06-07 星期五 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import selectUserDialog from './components/selectUserDialog.vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import type { IPageParams } from '@/typings/pageParams'
import {
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
  authUserSelectAll,
} from '@/api/system/role'
import { useDict } from '@/utils/dict'

defineOptions({
  name: 'AuthUser',
})

const route = useRoute()

const { handleCloseCurrent } = useTagViewsStore()

const { sys_normal_disable } = useDict('sys_normal_disable')

const selectedKeys = ref([])

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

const searchParams = ref({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

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
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
  },
])

const tableData = ref([])

const loading = ref(false)

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await allocatedUserList({
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

// 批量取消授权
function handleBatchCancelAllocation() {
  Modal.confirm({
    title: '系统通知',
    content: '是否取消选中用户授权数据项?',
    async onOk() {
      const { code }: any = await authUserCancelAll({
        roleId: route.params?.roleId,
        userIds: selectedKeys.value.join(','),
      })
      if (code === 200) {
        Message.success('取消授权成功!')
        selectedKeys.value = []
        await loadData()
      }
    },
  })
}

// 取消授权
function handleCancelAllocation(cellItem: any) {
  Modal.confirm({
    title: '系统通知',
    content: `确认要取消该用户${cellItem?.userName}角色吗?`,
    async onOk() {
      const { code }: any = await authUserCancel({
        roleId: route.params?.roleId,
        userId: cellItem?.userId,
      })
      if (code === 200) {
        Message.success('取消授权成功!')
        await loadData()
      }
    },
  })
}

// 添加用户
const selectUserShow = ref(false)

const SelectUserDialogRef = shallowRef()

function handleSelectUser() {
  selectUserShow.value = true
  nextTick(() => {
    SelectUserDialogRef.value.loadData()
  })
}

async function handleSelectUserSubmit(userIds: any, done: any) {
  try {
    const { code }: any = await authUserSelectAll({ roleId: route.params?.roleId, userIds })
    if (code === 200) {
      Message.success('操作成功!')
      done()
      selectUserShow.value = false
      await loadData()
    }
  }
  catch (e) {
    done()
  }
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
    row-key="userId"
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
      <a-button status="success" @click="handleSelectUser">
        <template #icon>
          <icon-plus />
        </template>
        添加用户
      </a-button>

      <a-button
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleBatchCancelAllocation"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量取消授权
      </a-button>

      <a-button @click="handleCloseCurrent('/system/role')">
        <template #icon>
          <icon-close />
        </template>
        关闭
      </a-button>
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_normal_disable" />
    </template>

    <template #operate="{ record }">
      <a-link status="danger" @click="handleCancelAllocation(record)">
        <template #icon>
          <icon-close />
        </template>
        取消授权
      </a-link>
    </template>
  </crud-table>

  <select-user-dialog
    ref="SelectUserDialogRef"
    v-model:visible="selectUserShow"
    :sys-normal-disable="sys_normal_disable"
    @submit="handleSelectUserSubmit"
  />
</template>

<style scoped lang="scss"></style>
