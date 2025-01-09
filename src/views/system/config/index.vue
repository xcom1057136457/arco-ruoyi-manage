<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import operateDialog from './components/operateDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { useDict } from '@/utils/dict'
import {
  addConfig,
  delConfig,
  getConfig,
  listConfig,
  refreshCache,
  updateConfig,
} from '@/api/system/config'
import { download } from '@/utils/request'

defineOptions({
  name: 'Config',
})

const { startLoading, endLoading } = useLoadingStore()

const route = useRoute()

const { sys_yes_no } = useDict('sys_yes_no')

const selectedKeys = ref([])

const searchParams = ref<any>({})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

const loading = ref(false)

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '参数名称',
      field: 'configName',
      type: 'a-input',
    },
    {
      label: '参数键名',
      field: 'configKey',
      type: 'a-input',
    },
    {
      label: '系统内置',
      field: 'configType',
      type: 'a-select',
      dictData: sys_yes_no.value,
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
    title: '参数主键',
    dataIndex: 'configId',
    width: 100,
  },
  {
    title: '参数名称',
    dataIndex: 'configName',
    width: 250,
  },
  {
    title: '参数键名',
    dataIndex: 'configKey',
    width: 250,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '参数键值',
    dataIndex: 'configValue',
    width: 150,
  },
  {
    title: '系统内置',
    dataIndex: 'configType',
    width: 100,
    slotName: 'configType',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
    width: 160,
    fixed: 'right',
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
    }: any = await listConfig({
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

const rowId = ref('')

const operateShow = ref(false)

const OperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
}

// 编辑
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.configId
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getConfig(rowId.value)
    if (code === 200) {
      OperateDialogRef.value.formParams = cloneDeep(data)
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateConfig : addConfig
  try {
    const { code }: any = await func({ ...formParams, configId: rowId.value })
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
  const configIds = cellItem?.configId || selectedKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除参数编号为${configIds}的数据项?`,
    async onOk() {
      const { code }: any = await delConfig(configIds)
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
    '/system/config/export',
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
    v-model:loading="loading"
    v-model:selected-keys="selectedKeys"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:table-columns="tableColumns"
    row-key="configId"
    :search-columns="searchColumns"
    :total
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    :scroll="{ x: 1800 }"
    :table-data="tableData"
    @load-data="loadData"
  >
    <template #operateBtns>
      <a-button
        v-has-permi="['system:config:add']"
        status="success"
        @click="handleAdd"
      >
        <template #icon>
          <icon-plus />
        </template>
        新增
      </a-button>

      <a-button
        v-has-permi="['system:config:remove']"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="handleDelete()"
      >
        <template #icon>
          <icon-delete />
        </template>
        批量刪除
      </a-button>

      <a-button
        v-has-permi="['system:config:export']"
        status="warning"
        @click="handleExport"
      >
        <template #icon>
          <icon-download />
        </template>
        导出
      </a-button>

      <a-button
        v-has-permi="['system:config:remove']"
        status="danger"
        @click="handleRefreshCache"
      >
        <template #icon>
          <icon-refresh />
        </template>
        刷新缓存
      </a-button>
    </template>

    <template #configType="{ record }">
      <dict-tag :value="record.configType" :options="sys_yes_no" />
    </template>

    <template #operate="{ record }">
      <div space-x-xs>
        <a-link
          v-has-permi="['system:config:edit']"
          status="warning"
          @click="handleEdit(record)"
        >
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-link>

        <a-link
          v-has-permi="['system:config:remove']"
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
    :sys-yes-no="sys_yes_no"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
