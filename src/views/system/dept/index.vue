<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import operateDialog from './components/operateDialog.vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  addDept,
  delDept,
  getDept,
  listDept,
  listDeptExcludeChild,
  updateDept,
} from '@/api/system/dept'
import { handleTree } from '@/utils/utils'

defineOptions({
  name: 'Dept',
})

const { sys_normal_disable } = useDict('sys_normal_disable')

const searchParams = ref({})

const expandedKeys = ref([])

const loading = ref(false)

const tableData = ref<any>([])

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '部门名称',
      field: 'deptName',
      type: 'a-input',
    },
    {
      label: '状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_normal_disable.value,
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '部门名称',
    dataIndex: 'deptName',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
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

// 是否展开
const isExpandAll = ref(true)

// CrudTable实例
const CrudTableRef = shallowRef()

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const { code, data }: any = await listDept(searchParams.value)
    if (code === 200) {
      tableData.value = handleTree(data, 'deptId')
      setTimeout(() => {
        handleExpand()
      })
    }
  }
  finally {
    loading.value = false
  }
}

// 折叠/展开
function handleExpand() {
  CrudTableRef.value.expandTable(isExpandAll.value)
  isExpandAll.value = !isExpandAll.value
}

const operateShow = ref(false)

const rowId = ref('')

const deptTreeData = ref<any[]>([])

const OperateDialogRef = shallowRef()

// 新增
function handleAdd(cellItem?: any) {
  rowId.value = ''
  operateShow.value = true
  nextTick(async () => {
    if (cellItem && cellItem?.deptId) {
      OperateDialogRef.value.formParams.parentId = cellItem?.deptId
    }

    const { code, data }: any = await listDept()
    if (code === 200) {
      deptTreeData.value = handleTree(data, 'deptId')
    }
  })
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.deptId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await listDeptExcludeChild(rowId.value)
    if (code === 200) {
      deptTreeData.value = handleTree(data, 'deptId')
    }

    const { code: deptCode, data: deptData }: any = await getDept(rowId.value)
    if (deptCode === 200) {
      OperateDialogRef.value.formParams = deptData
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateDept : addDept
  try {
    const { code }: any = await func({ ...formParams, deptId: rowId.value })
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
function handleDelete(cellItem: any) {
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除名称为${cellItem?.deptName}的数据项?`,
    async onOk() {
      const { code }: any = await delDept(cellItem?.deptId)
      if (code === 200) {
        Message.success('删除成功!')
        await loadData()
      }
    },
  })
}
</script>

<template>
  <crud-table
    ref="CrudTableRef"
    v-model:expanded-keys="expandedKeys"
    v-model:search-params="searchParams"
    v-model:loading="loading"
    v-model:table-columns="tableColumns"
    :search-columns="searchColumns"
    :table-data="tableData"
    row-key="deptId"
    default-expand-all-rows
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button @click="handleExpand">
        <template #icon>
          <icon-expand />
        </template>
        折叠/展开
      </a-button>

      <a-button status="success" @click="handleAdd()">
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_normal_disable" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link status="warning" @click="handleEdit(record)">
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link status="success" @click="handleAdd(record)">
          <template #icon>
            <icon-plus />
          </template>
          新增
        </a-link>

        <a-link status="danger" @click="handleDelete(record)">
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-link>
      </div>
    </template>
  </crud-table>

  <operate-dialog
    ref="OperateDialogRef"
    v-model:visible="operateShow"
    :sys-normal-disable="sys_normal_disable"
    :dept-tree-data="deptTreeData"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
