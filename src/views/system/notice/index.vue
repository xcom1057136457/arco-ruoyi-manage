<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import operateDialog from './components/operateDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  addNotice,
  delNotice,
  getNotice,
  listNotice,
  updateNotice,
} from '@/api/system/notice'

defineOptions({
  name: 'Notice',
})

const { sys_notice_type, sys_notice_status } = useDict(
  'sys_notice_type',
  'sys_notice_status',
)

const selectedKeys = ref([])

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
      label: '公告标题',
      field: 'noticeTitle',
      type: 'a-input',
    },
    {
      label: '公告类型',
      field: 'noticeType',
      type: 'a-select',
      dictData: sys_notice_type.value,
    },
    {
      label: '创建者',
      field: 'createBy',
      type: 'a-input',
    },
  ]
})

const tableColumns = ref<TableColumnData[]>([
  {
    title: '公告标题',
    dataIndex: 'noticeTitle',
  },
  {
    title: '公告类型',
    dataIndex: 'noticeType',
    slotName: 'noticeType',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '创建者',
    dataIndex: 'createBy',
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

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listNotice({ ...searchParams.value, ...pageParams.value })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

const rowId = ref('')

const operateShow = ref(false)

const OperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.noticeId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getNotice(rowId.value)
    if (code === 200) {
      OperateDialogRef.value.formParams = data
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateNotice : addNotice
  try {
    const { code }: any = await func({ ...formParams, noticeId: rowId.value })
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
async function handleDelete(cellItem?: any) {
  const noticeIds = cellItem?.noticeId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除公告编号为${noticeIds}的数据项?`,
    async onOk() {
      const { code }: any = await delNotice(noticeIds)
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
    v-model:selected-keys="selectedKeys"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:loading="loading"
    v-model:table-columns="tableColumns"
    row-key="noticeId"
    :total
    :search-columns="searchColumns"
    :table-data="tableData"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['system:notice:add']"
        status="success"
        @click="handleAdd"
      >
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>

      <a-button
        v-has-permi="['system:notice:remove']"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleDelete()"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量删除
      </a-button>
    </template>

    <template #noticeType="{ record }">
      <dict-tag :value="record.noticeType" :options="sys_notice_type" />
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_notice_status" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link
          v-has-permi="['system:notice:edit']"
          status="warning"
          @click="handleEdit(record)"
        >
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['system:notice:remove']"
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
    :sys-notice-type="sys_notice_type"
    :sys-notice-status="sys_notice_status"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
