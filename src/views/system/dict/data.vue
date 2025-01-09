<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
<script setup lang="ts">
import { Message, Modal, type TableColumnData } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import dictOperateDialog from './components/dictOperateDialog.vue'
import type { IPageParams } from '@/typings/pageParams'
import type { ISearchColumns } from '@/components/CrudTable/types'
import { optionselect } from '@/api/system/dict/type'
import { useDict } from '@/utils/dict'
import {
  addData,
  delData,
  getData,
  listData,
  updateData,
} from '@/api/system/dict/data'
import { download } from '@/utils/request'

defineOptions({
  name: 'DictData',
})

const route = useRoute()

const { startLoading, endLoading } = useLoadingStore()

const { sys_normal_disable } = useDict('sys_normal_disable')

const { handleCloseCurrent } = useTagViewsStore()

const searchParams = ref<any>({
  dictType: route.params?.dictType,
})

const pageParams = ref<IPageParams>({
  pageNum: 1,
  pageSize: 10,
})

const loading = ref(false)

const selectKeys = ref([])

const total = ref(0)

// 字典名称类型
const typeOptions = ref([])

const searchColumns = computed((): ISearchColumns[] => {
  return [
    {
      label: '字典名称',
      field: 'dictType',
      type: 'a-select',
      dictData: typeOptions.value,
      dictDataOption: {
        label: 'dictName',
        value: 'dictType',
      },
    },
    {
      label: '字典标签',
      field: 'dictLabel',
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
    title: '字典编码',
    dataIndex: 'dictCode',
  },
  {
    title: '字典标签',
    dataIndex: 'dictLabel',
    slotName: 'dictLabel',
  },
  {
    title: '字典键值',
    dataIndex: 'dictValue',
  },
  {
    title: '字典排序',
    dataIndex: 'dictSort',
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

const tableData = ref([])

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const {
      code,
      rows,
      total: totalData,
    }: any = await listData({ ...searchParams.value, ...pageParams.value })
    if (code === 200) {
      tableData.value = rows
      total.value = totalData
    }
  }
  finally {
    loading.value = false
  }
}

// 加载字典名称类型
async function loadDictType() {
  const { code, data }: any = await optionselect()
  if (code === 200) {
    typeOptions.value = data
  }
}

loadDictType()

const operateShow = ref(false)

const rowId = ref('')

const DictOperateDialogRef = shallowRef()

// 新增
function handleAdd() {
  rowId.value = ''
  operateShow.value = true
}

// 修改
function handleEdit(cellItem: any) {
  rowId.value = cellItem?.dictCode
  operateShow.value = true
  nextTick(async () => {
    const { code, data }: any = await getData(rowId.value)
    if (code === 200) {
      DictOperateDialogRef.value.formParams = cloneDeep(data)
    }
  })
}

// 表单提交
async function handleSubmit(formParams: any, done: any) {
  const func = rowId.value ? updateData : addData
  try {
    const { code }: any = await func({
      ...formParams,
      dictCode: rowId.value,
      dictType: searchParams.value.dictType,
    })
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
  const dictCodes = cellItem?.dictCode || selectKeys.value
  Modal.confirm({
    title: '系统通知',
    content: `是否确认删除字典编码为${dictCodes}的数据项?`,
    bodyClass: 'break-all',
    async onOk() {
      const { code }: any = await delData(dictCodes)
      if (code === 200) {
        Message.success('删除成功!')
        await loadData()
      }
    },
  })
}

// tag样式格式化
function fColor(type: string) {
  if (!type) {
    return ''
  }
  const colorObj: any = {
    primary: () => {
      return 'blue'
    },
    danger: () => {
      return 'red'
    },
    success: () => {
      return 'green'
    },
    info: () => {
      return 'gray'
    },
    warning: () => {
      return 'orangered'
    },
  }
  if (colorObj[type]) {
    return colorObj[type]()
  }
}

// 导出
async function handleExport() {
  startLoading()
  await download(
    '/system/dict/data/export',
    searchParams.value,
    `${route.meta?.title}_${new Date().getTime()}.xlsx`,
  )
  endLoading()
}
</script>

<template>
  <crud-table
    v-model:selected-keys="selectKeys"
    v-model:loading="loading"
    v-model:search-params="searchParams"
    v-model:page-num="pageParams.pageNum"
    v-model:page-size="pageParams.pageSize"
    v-model:table-columns="tableColumns"
    :search-columns="searchColumns"
    :total
    row-key="dictCode"
    :row-selection="{
      type: 'checkbox',
      showCheckedAll: true,
    }"
    :table-data="tableData"
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

      <a-button @click="() => handleCloseCurrent('/system/dict')">
        <template #icon>
          <icon-close />
        </template>
        关闭
      </a-button>
    </template>

    <template #dictLabel="{ record }">
      <span v-if="record.listClass === '' || record.listClass === 'default'">
        {{ record.dictLabel }}
      </span>

      <a-tag
        v-else
        :color="record.listClass ? fColor(record.listClass) : 'arcoblue'"
      >
        {{ record.dictLabel }}
      </a-tag>
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

        <a-link status="danger" @click="handleDelete(record)">
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-link>
      </div>
    </template>
  </crud-table>

  <dict-operate-dialog
    ref="DictOperateDialogRef"
    v-model:visible="operateShow"
    :row-id="rowId"
    :sys-normal-disable="sys_normal_disable"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
