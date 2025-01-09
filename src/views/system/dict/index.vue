<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import operateDialog from './components/operateDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  addType,
  delType,
  getType,
  listType,
  refreshCache,
  updateType,
} from '@/api/system/dict/type'
import { download } from '@/utils/request'

defineOptions({
  name: 'Dict',
})

const route = useRoute()

const router = useRouter()

const { startLoading, endLoading } = useLoadingStore()

const { sys_normal_disable } = useDict('sys_normal_disable')

const searchParams = ref<any>({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const selectKeys = ref([])

const total = ref(0)

const tableData = ref([])

const loading = ref(false)

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '字典名称',
      field: 'dictName',
      type: 'a-input',
    },
    {
      label: '字典类型',
      field: 'dictType',
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

const tableColumns = ref<TableColumnData[]>([
  {
    title: '字典编号',
    dataIndex: 'dictId',
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    slotName: 'dictType',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
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

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listType({
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
  rowId.value = cellItem?.dictId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getType(rowId.value)
    if (code === 200) {
      OperateDialogRef.value.formParams = cloneDeep(data)
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateType : addType
  try {
    const { code }: any = await func({ ...formParams, dictId: rowId.value })
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
  const dictIds = cellItem?.dictId || selectKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除字典编号为${dictIds}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delType(dictIds)
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
    '/system/dict/type/export',
    {
      ...searchParams.value,
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

// 刷新缓存
function handleRefreshCache() {
  Modal.confirm({
    title: '系统通知',
    content: '是否刷新缓存?',
    async onOk() {
      const { code }: any = await refreshCache()
      if (code === 200) {
        Message.success('刷新缓存成功!')
        await loadData()
      }
    },
  })
}
</script>

<template>
  <crud-table
    v-model:selected-keys="selectKeys"
    v-model:search-params="searchParams"
    v-model:table-columns="tableColumns"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:loading="loading"
    :total
    :table-data="tableData"
    :search-columns="searchColumns"
    row-key="dictId"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['system:dict:add']"
        status="success"
        @click="handleAdd"
      >
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>

      <a-button
        v-has-permi="['system:dict:remove']"
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
        v-has-permi="['system:dict:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button
        v-has-permi="['system:dict:remove']"
        status="danger"
        @click="handleRefreshCache"
      >
        <template #icon>
          <icon-refresh />
        </template>
        刷新缓存
      </a-button>
    </template>

    <template #status="{ record }">
      <dict-tag :value="record.status" :options="sys_normal_disable" />
    </template>

    <template #dictType="{ record }">
      <a-link
        :hoverable="false"
        @click="
          () =>
            router.push(
              `/system/dict-data/index/${record.dictId}/${record.dictType}`,
            )
        "
      >
        {{ record.dictType }}
      </a-link>
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link
          v-has-permi="['system:dict:edit']"
          status="warning"
          @click="handleEdit(record)"
        >
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['system:dict:remove']"
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
