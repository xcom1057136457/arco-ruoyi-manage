<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import {
  Message,
  Modal,
  type TableColumnData,
  type TreeInstance,
} from '@arco-design/web-vue'
import resetPasswordDialog from './components/resetPasswordDialog.vue'
import operateDialog from './components/operateDialog.vue'
import userImportDialog from './components/userImportDialog.vue'
import {
  addUser,
  changeUserStatus,
  delUser,
  deptTreeSelect,
  getUser,
  listUser,
  resetUserPwd,
  updateUser,
} from '@/api/system/user'
import { useDict } from '@/utils/dict'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { download } from '@/utils/request'

defineOptions({
  name: 'User',
})

const { startLoading, endLoading } = useLoadingStore()

const route = useRoute()

const router = useRouter()

const { sys_normal_disable, sys_user_sex } = useDict(
  'sys_normal_disable',
  'sys_user_sex',
)

const selectedKeys = ref([])

const searchKey = ref('')

const deptId = ref('')

const DeptTreeRef = shallowRef<TreeInstance>()

// 查询部门下拉树结构
const deptTreeData = ref([])

async function getDeptTree() {
  const { code, data }: any = await deptTreeSelect()
  if (code === 200) {
    deptTreeData.value = data
    setTimeout(() => {
      DeptTreeRef.value?.expandAll(true)
    })
  }
}

getDeptTree()

// 筛选过的tree数据
const treeData = computed(() => {
  if (!searchKey.value)
    return deptTreeData.value
  return searchData(searchKey.value)
})

// 搜索树
function searchData(keyword: any) {
  const loop = (data: any) => {
    const result: any = []
    data.forEach((item: any) => {
      if (item.label.toLowerCase().includes(keyword.toLowerCase())) {
        result.push({ ...item })
      }
      else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          })
        }
      }
    })
    return result
  }

  return loop(deptTreeData.value)
}

// 加载表格数据
const searchParams = ref<any>({})

const pageParams = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
})

const tableData = ref([])

const tableColumns = ref<TableColumnData[]>([
  {
    title: '用户编号',
    dataIndex: 'userId',
    width: 100,
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    slotName: 'sex',
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    width: 100,
    slotName: 'deptName',
    tooltip: true,
    ellipsis: true,
  },
  {
    title: '手机号码',
    dataIndex: 'phonenumber',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
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
    width: 180,
    slotName: 'operate',
    fixed: 'right',
  },
])

const searchColumns = computed((): ISearchColumns[] => {
  return [
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

const total = ref(0)

const loading = ref(false)

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listUser({
      ...searchParams.value,
      ...pageParams.value,
      deptId: deptId.value,
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

// 部门树点击
function handleTreeSelect(selectedKeys: any) {
  deptId.value = selectedKeys[0]
  loadData()
}

// 用户状态修改
function handleStatusChange(cellItem: any) {
  const text = cellItem.status === '0' ? '启用' : '停用'
  Modal.confirm({
    title: '系统通知',
    content: `确认要${text}${cellItem?.userName}用户吗?`,
    async onOk() {
      try {
        const { code }: any = await changeUserStatus(cellItem?.userId, cellItem?.status)
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

const rowId = ref('')

const operateShow = ref(false)

const postOptions = ref([])

const roleOptions = ref([])

const OperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
  nextTick(async () => {
    const { code, posts, roles }: any = await getUser()
    if (code === 200) {
      postOptions.value = posts
      roleOptions.value = roles
    }
  })
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.userId
  operateShow.value = true
  nextTick(async () => {
    const { code, posts, roles, data, postIds, roleIds }: any = await getUser(
      rowId.value,
    )
    if (code === 200) {
      postOptions.value = posts
      roleOptions.value = roles
      OperateDialogRef.value.formParams = { ...data, postIds, roleIds }
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateUser : addUser
  try {
    const { code }: any = await func({ ...formParams, userId: rowId.value })
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

// 重置密码
const resetPasswordShow = ref(false)

const ResetPasswordDialogRef = shallowRef()

function handleResetPassword(cellItem: any) {
  rowId.value = cellItem?.userId
  resetPasswordShow.value = true
  ResetPasswordDialogRef.value.username = cellItem.userName
}

async function handleResetPasswordSubmit({ password }: any, done: any) {
  try {
    const { code }: any = await resetUserPwd(rowId.value, password)
    if (code === 200) {
      Message.success('密码修改成功!')
      done()
      resetPasswordShow.value = false
      await loadData()
    }
  }
  catch (e) {
    done()
  }
}

// 删除
function handleDelete(cellItem?: any) {
  const userIds = cellItem?.userId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除用户编号为${userIds}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delUser(userIds)
      if (code === 200) {
        Message.success('删除成功!')
        selectedKeys.value = []
        await loadData()
      }
    },
  })
}

// 导出
async function handleExport() {
  startLoading('下载中...')
  await download(
    '/system/user/export',
    {
      ...searchParams.value,
      deptId: deptId.value,
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
    },
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}

// 用户导入
const userImportShow = ref(false)

// 分配角色
function handleAuthRole(cellItem: any) {
  router.push({
    name: 'AuthRole',
    params: {
      userId: cellItem?.userId,
    },
  })
}
</script>

<template>
  <a-row :gutter="10" align="stretch" h="[calc(100vh-81px-24px)]" box-border overflow-hidden>
    <a-col :span="4" h-full>
      <div h-full bg-bg-color-2 flex="~ col">
        <div p="x-2 t-2 b-0" box-border>
          <a-input-search
            v-model="searchKey"
            placeholder="输入部门名称..."
            mb-2
          />
        </div>

        <div flex-1 overflow-auto px-2>
          <a-tree
            ref="DeptTreeRef"
            :data="treeData"
            block-node
            :field-names="{ title: 'label', children: 'children', key: 'id' }"
            show-line
            @select="handleTreeSelect"
          />
        </div>
      </div>
    </a-col>

    <a-col :span="20" h-full overflow="x-hidden y-auto">
      <crud-table
        v-model:loading="loading"
        v-model:selected-keys="selectedKeys"
        v-model:page-num="pageParams.pageNum"
        v-model:page-size="pageParams.pageSize"
        v-model:search-params="searchParams"
        v-model:table-columns="tableColumns"
        :table-data="tableData"
        :total
        :search-columns="searchColumns"
        :search-columns-span="3"
        :row-selection="{
          showCheckedAll: true,
          type: 'checkbox',
        }"
        :scroll="{ x: 1450 }"
        row-key="userId"
        @load-data="loadData"
      >
        <template #operateBtns>
          <div space-x-xs>
            <a-button v-has-permi="['system:user:add']" status="success" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>

            <a-button
              v-has-permi="['system:user:remove']"
              status="danger"
              :disabled="selectedKeys.length === 0"
              @click="handleDelete()"
            >
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>

            <a-button v-has-permi="['system:user:import']" status="warning" @click="userImportShow = true">
              <template #icon>
                <icon-upload />
              </template>
              导入
            </a-button>

            <a-button v-has-permi="['system:user:export']" status="warning" @click="handleExport">
              <template #icon>
                <icon-download />
              </template>
              导出
            </a-button>
          </div>
        </template>

        <template #deptName="{ record }">
          {{ record.dept && record.dept.deptName }}
        </template>

        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            checked-value="0"
            unchecked-color="1"
            @change="handleStatusChange(record)"
          />
        </template>

        <template #sex="{ record }">
          <dict-tag :value="record.sex" :options="sys_user_sex" />
        </template>

        <template #operate="{ record }">
          <div v-if="record.userId !== 1" space-x-xs>
            <a-link v-has-permi="['system:user:edit']" status="warning" @click="handleEdit(record)">
              <template #icon>
                <icon-edit />
              </template>
              修改
            </a-link>

            <a-link v-has-permi="['system:user:remove']" status="danger" @click="handleDelete(record)">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-link>

            <a-dropdown trigger="hover">
              <a-link v-has-permi="['system:user:resetPwd', 'system:user:edit']" status="success">
                <template #icon>
                  <icon-more />
                </template>
                更多
              </a-link>
              <template #content>
                <a-doption v-has-permi="['system:user:resetPwd']" @click="handleResetPassword(record)">
                  <template #icon>
                    <div i-material-symbols-key-vertical />
                  </template>
                  重置密码
                </a-doption>

                <a-doption v-has-permi="['system:user:edit']" @click="handleAuthRole(record)">
                  <template #icon>
                    <icon-branch />
                  </template>
                  分配角色
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </template>
      </crud-table>
    </a-col>
  </a-row>

  <operate-dialog
    ref="OperateDialogRef"
    v-model:visible="operateShow"
    :row-id="rowId"
    :dept-options="deptTreeData"
    :sys-user-sex="sys_user_sex"
    :sys-normal-disable="sys_normal_disable"
    :post-options="postOptions"
    :role-options="roleOptions"
    @submit="handleSubmit"
  />

  <reset-password-dialog
    ref="ResetPasswordDialogRef"
    v-model:visible="resetPasswordShow"
    @submit="handleResetPasswordSubmit"
  />

  <user-import-dialog v-model:visible="userImportShow" @submit="loadData" />
</template>

<style scoped lang="scss"></style>
