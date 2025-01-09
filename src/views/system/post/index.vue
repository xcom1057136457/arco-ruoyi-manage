<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import operateDialog from './components/operateDialog.vue'
import type { ISearchColumns } from '@/components/CrudTable/types'
import type { IPageParams } from '@/typings/pageParams'
import { useDict } from '@/utils/dict'
import {
  addPost,
  delPost,
  getPost,
  listPost,
  updatePost,
} from '@/api/system/post'
import { download } from '@/utils/request'

defineOptions({
  name: 'Post',
})

const route = useRoute()

const { startLoading, endLoading } = useLoadingStore()

const { sys_normal_disable } = useDict('sys_normal_disable')

const searchParams = ref({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const selectKeys = ref([])

const loading = ref(false)

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '岗位编码',
      field: 'postCode',
      type: 'a-input',
    },
    {
      label: '岗位名称',
      field: 'postName',
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
    title: '岗位编号',
    dataIndex: 'postId',
  },
  {
    title: '岗位编码',
    dataIndex: 'postCode',
  },
  {
    title: '岗位名称',
    dataIndex: 'postName',
  },
  {
    title: '岗位排序',
    dataIndex: 'postSort',
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

const total = ref(0)

const tableData = ref([])

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listPost({ ...searchParams.value, ...pageParams.value })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

const operateShow = ref(false)

const rowId = ref('')

const OperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.postId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getPost(rowId.value)
    if (code === 200) {
      data.postSort = Number(data.postSort)
      OperateDialogRef.value.formParams = data
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updatePost : addPost
  try {
    const { code }: any = await func({ ...formParams, postId: rowId.value })
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
function handleDelete(cellItem?: any) {
  const postIds: any = cellItem?.postId || selectKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除岗位编号为${postIds}的数据项?`,
    async onOk() {
      const { code }: any = await delPost(postIds)
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
    '/system/post/export',
    searchParams.value,
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}
</script>

<template>
  <crud-table
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:table-columns="tableColumns"
    v-model:selected-keys="selectKeys"
    :search-columns="searchColumns"
    :table-data="tableData"
    :total
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    row-key="postId"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['system:post:add']"
        status="success"
        @click="handleAdd"
      >
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>

      <a-button
        v-has-permi="['system:post:remove']"
        status="danger"
        :disabled="selectKeys.length === 0"
        @click="handleDelete()"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>

      <a-button
        v-has-permi="['system:post:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_normal_disable" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link
          v-has-permi="['system:post:edit']"
          status="warning"
          @click="handleEdit(record)"
        >
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['system:post:remove']"
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

  <operate-dialog
    ref="OperateDialogRef"
    v-model:visible="operateShow"
    :row-id="rowId"
    :sys-normal-disable="sys_normal_disable"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
