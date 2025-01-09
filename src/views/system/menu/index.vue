<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import operateDialog from './components/operateDialog.vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from '@/api/system/menu'
import { handleTree } from '@/utils/utils'

defineOptions({
  name: 'Menu',
})

const CrudTableRef = shallowRef()

const { sys_normal_disable, sys_show_hide } = useDict(
  'sys_normal_disable',
  'sys_show_hide',
)

const searchParams = ref({})

const total = ref(0)

const loading = ref(false)

const tableData = ref<any>([])

const tableColumns = ref<TableColumnData[]>([
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    width: 200,
    fixed: 'left',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 100,
    slotName: 'icon',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    width: 100,
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 70,
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 220,
    fixed: 'right',
    slotName: 'operate',
  },
])

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '菜单名称',
      field: 'menuName',
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

const expandedKeys = ref([])

async function loadData() {
  loading.value = true
  try {
    const { code, data }: any = await listMenu(searchParams.value)
    if (code === 200) {
      tableData.value = handleTree(data, 'menuId')
    }
  }
  finally {
    loading.value = false
  }
}

// 折叠/展开
const isExpand = ref(false)

function handleExpand() {
  isExpand.value = !isExpand.value
  CrudTableRef.value.expandTable(isExpand.value)
}

// 获取菜单tree数据
const menuTreeData = ref<any[]>([])

const tablePageSize = ref(100)

async function loadMenuTreeData() {
  const { code, data }: any = await listMenu()
  if (code === 200) {
    const menu: any = { menuId: 0, menuName: '主类目', children: [] }
    menu.children = handleTree(data, 'menuId')
    menuTreeData.value.push(menu)
  }
}

loadMenuTreeData()

const operateShow = ref(false)

const rowId = ref('')

const OperateDialogRef = shallowRef()

// 新增
function handleAdd(cellItem?: any) {
  rowId.value = ''
  operateShow.value = true
  nextTick(() => {
    if (cellItem !== null && cellItem?.menuId) {
      OperateDialogRef.value.formParams.parentId = cellItem?.menuId
    }
    else {
      OperateDialogRef.value.formParams.parentId = 0
    }
  })
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.menuId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getMenu(cellItem?.menuId)
    if (code === 200) {
      OperateDialogRef.value.formParams = data
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateMenu : addMenu
  try {
    const { code }: any = await func({ ...formParams, menuId: rowId.value })
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
    content: `是否确认删除名称为${cellItem?.menuName}的数据项?`,
    async onOk() {
      const { code }: any = await delMenu(cellItem?.menuId)
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
    v-model:table-columns="tableColumns"
    v-model:expanded-keys="expandedKeys"
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:page-size="tablePageSize"
    :total
    :table-data="tableData"
    :search-columns="searchColumns"
    row-key="menuId"
    :scroll="{ x: 1500 }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button @click="handleExpand">
        <template #icon>
          <icon-expand />
        </template>
        折叠/展开
      </a-button>

      <a-button v-has-permi="['system:menu:add']" status="success" @click="handleAdd()">
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>
    </template>

    <template #icon="{ record }">
      <svg-icon :icon-class="record.icon" />
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_normal_disable" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link v-has-permi="['system:menu:edit']" status="warning" @click="handleEdit(record)">
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link v-has-permi="['system:menu:add']" status="success" @click="handleAdd(record)">
          <template #icon>
            <icon-plus />
          </template>
          新增
        </a-link>

        <a-link v-has-permi="['system:menu:remove']" status="danger" @click="handleDelete(record)">
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
    :row-id="rowId"
    :menu-tree-data="menuTreeData"
    :sys-show-hide="sys_show_hide"
    :sys-normal-disable="sys_normal_disable"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
