<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import operateDialog from './components/operateDialog.vue'
import { useDict } from '@/utils/dict'
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  deptTreeSelect,
  getRole,
  listRole,
  updateRole,
} from '@/api/system/role'
import { roleMenuTreeselect, treeselect } from '@/api/system/menu'
import { download } from '@/utils/request'
import type { ISearchColumns } from '@/components/CrudTable/types'
import dataPermiDialog from '@/views/system/role/components/dataPermiDialog.vue'

defineOptions({
  name: 'Role',
})

const route = useRoute()

const router = useRouter()

const { startLoading, endLoading } = useLoadingStore()

const { sys_normal_disable } = useDict('sys_normal_disable')

// 获取表格数据
const searchParams = ref<any>({})

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '角色名称',
      field: 'roleName',
      type: 'a-input',
    },
    {
      label: '权限字符',
      field: 'roleKey',
      type: 'a-input',
    },
    {
      label: '状态',
      field: 'status',
      type: 'a-select',
      dictData: sys_normal_disable.value,
    },
    {
      label: '创建时间',
      field: 'createTime',
      type: 'a-range-picker',
    },
  ]
})

const selectedKeys = ref([])

const pageParams = ref({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

const loading = ref(false)

const tableData = ref([])

const tableColumns = ref<TableColumnData[]>([
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
    title: '显示顺序',
    dataIndex: 'roleSort',
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
    width: 220,
    slotName: 'operate',
  },
])

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listRole({
      ...searchParams.value,
      ...pageParams.value,
      params: {
        beginTime:
          searchParams.value.createTime && searchParams.value.createTime.length
            ? searchParams.value.createTime[0]
            : '',
        endTime:
          searchParams.value.createTime && searchParams.value.createTime.length
            ? searchParams.value.createTime[1]
            : '',
      },
      createTime: '',
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

// 获取tree数据
const menuOptions = ref([])

async function loadMenuTreeData() {
  const { code, data }: any = await treeselect()
  if (code === 200) {
    menuOptions.value = data
  }
}

// 根据角色ID查询菜单树结构
async function getMenuTreeByRole(roleId: any) {
  const { code, menus, checkedKeys }: any = await roleMenuTreeselect(roleId)
  if (code === 200) {
    menuOptions.value = menus
    return Promise.resolve(checkedKeys)
  }
}

const operateShow = ref(false)

const OperateDialogRef = shallowRef()

const rowId = ref('')

// 新增
function handleAdd() {
  operateShow.value = true
  rowId.value = ''
  loadMenuTreeData()
}

// 修改
async function handleEdit(cellItem: any) {
  rowId.value = cellItem?.roleId
  operateShow.value = true
  await nextTick(async () => {
    const checkedKeys = await getMenuTreeByRole(rowId.value)
    const { code, data }: any = await getRole(rowId.value)
    if (code === 200) {
      OperateDialogRef.value.formParams = cloneDeep(data)
      OperateDialogRef.value.formParams.roleSort = Number(
        OperateDialogRef.value.formParams.roleSort,
      )
      OperateDialogRef.value.formParams.status = Number(
        OperateDialogRef.value.formParams.status,
      )
      setTimeout(() => {
        checkedKeys.forEach((item: any) => {
          OperateDialogRef.value.MenuTreeRef?.checkNode(item, true, false)
        })
      })
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateRole : addRole
  try {
    const { code }: any = await func({ ...formParams, roleId: rowId.value })
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
function handleDelete(roleId?: any) {
  const roleIds: any = roleId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除角色编号为${roleIds}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delRole(roleIds)
      if (code === 200) {
        Message.success('删除成功!')
        await loadData()
      }
    },
  })
}

// 导出
function handleExport() {
  startLoading('下载中...')
  try {
    download(
      '/system/role/export',
      {
        ...searchParams.value,
        params: {
          beginTime:
            searchParams.value.createTime
            && searchParams.value.createTime.length
              ? searchParams.value.createTime[0]
              : '',
          endTime:
            searchParams.value.createTime
            && searchParams.value.createTime.length
              ? searchParams.value.createTime[1]
              : '',
        },
      },
      `${route.meta?.title}_${new Date().getTime()}.xlsx`,
    )
  }
  finally {
    endLoading()
  }
}

// 状态切换
function handleStatusBeforeChange(cellItem: any) {
  const text = cellItem.status === '0' ? '启用' : '停用'
  Modal.confirm({
    title: '系统提示',
    content: `确认要${text}${cellItem.roleName}角色吗?`,
    async onOk() {
      try {
        const { code }: any = await changeRoleStatus(
          cellItem.roleId,
          cellItem.status,
        )
        if (code === 200) {
          Message.success(`${text}成功!`)
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

// 根据角色ID查询部门树结构
const deptTreeData = ref([])

async function getDeptTreeByRoleId(roleId: any) {
  const { code, depts, checkedKeys }: any = await deptTreeSelect(roleId)
  if (code === 200) {
    deptTreeData.value = depts
    return Promise.resolve(checkedKeys)
  }
}

// 分配数据权限
const dataPermiShow = ref(false)

const DataPermiDialogRef = shallowRef()

function handleAllocationDataPermi(cellItem: any) {
  dataPermiShow.value = true
  nextTick(async () => {
    const deptTreeSelect = await getDeptTreeByRoleId(cellItem.roleId)
    const { code, data }: any = await getRole(cellItem?.roleId)
    if (code === 200) {
      DataPermiDialogRef.value.formParams = { ...data, deptIds: deptTreeSelect }
    }
  })
}

async function handleDataPermiSubmit(formParams: any, done: any) {
  try {
    const { code }: any = await dataScope(formParams)
    if (code === 200) {
      Message.success('权限分配成功!')
      done()
      dataPermiShow.value = false
      await loadData()
    }
  }
  catch (e) {
    done()
  }
}

// 分配用户
function handleAllocationUser(cellItem: any) {
  router.push({
    name: 'AuthUser',
    params: {
      roleId: cellItem?.roleId,
    },
  })
}
</script>

<template>
  <crud-table
    v-model:search-params="searchParams"
    v-model:page-size="pageParams.pageSize"
    v-model:page-num="pageParams.pageNum"
    v-model:loading="loading"
    v-model:selected-keys="selectedKeys"
    v-model:table-columns="tableColumns"
    :search-columns="searchColumns"
    :total
    :table-data="tableData"
    :row-selection="{
      showCheckedAll: true,
      type: 'checkbox',
    }"
    row-key="roleId"
    @load-data="loadData"
  >
    <template #operateBtns>
      <div space-x-xs>
        <a-button
          v-has-permi="['system:role:add']"
          status="success"
          @click="handleAdd"
        >
          <template #icon>
            <icon-plus />
          </template>
          新增
        </a-button>

        <a-button
          v-has-permi="['system:role:remove']"
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
          v-has-permi="['system:role:export']"
          status="warning"
          @click="handleExport"
        >
          <template #icon>
            <icon-download />
          </template>
          导出
        </a-button>
      </div>
    </template>

    <template #status="{ record, tableConfig }">
      <a-switch
        v-model="record.status"
        checked-value="0"
        unchecked-value="1"
        :size="tableConfig.size as any"
        @change="handleStatusBeforeChange(record)"
      />
    </template>

    <template #operate="{ record }">
      <div v-if="record.roleId !== 1" flex space-x-xs>
        <a-link
          v-has-permi="['system:role:edit']"
          status="warning"
          @click="handleEdit(record)"
        >
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['system:role:remove']"
          status="danger"
          @click="handleDelete(record.roleId)"
        >
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-link>

        <a-dropdown trigger="hover">
          <a-link v-has-permi="['system:role:edit']" status="success">
            <template #icon>
              <icon-more />
            </template>
            更多
          </a-link>
          <template #content>
            <a-doption
              v-has-permi="['system:role:edit']"
              @click="handleAllocationDataPermi(record)"
            >
              <template #icon>
                <icon-safe />
              </template>
              数据权限
            </a-doption>

            <a-doption v-has-permi="['system:role:edit']" @click="handleAllocationUser(record)">
              <template #icon>
                <icon-branch />
              </template>
              分配用户
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
    :sys-normal-disable="sys_normal_disable"
    :menu-options="menuOptions"
    @submit="handleSubmit"
  />

  <data-permi-dialog
    ref="DataPermiDialogRef"
    v-model:visible="dataPermiShow"
    :dept-tree-data="deptTreeData"
    @submit="handleDataPermiSubmit"
  />
</template>

<style scoped lang="scss"></style>
