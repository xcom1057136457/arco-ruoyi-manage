<!-- 由 Dioa 创建于 2024-05-30 星期四 -->
<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  FormInstance,
  TableColumnData,
  TableData,
  TableInstance,
  TableRowSelection,
} from '@arco-design/web-vue'
import draggable from 'vuedraggable'
import type { ISearchColumns } from './types'

defineOptions({
  name: 'CrudTable',
})

const props = withDefaults(
  defineProps<{
    total?: number // 列表数据总数
    tableData?: any[] // 列表数据
    searchColumns?: ISearchColumns[] // 搜索表单配置
    searchColumnsSpan?: number // 搜索表单行数
    immediately?: boolean // 是否立即加载列表数据
    rowKey?: string // 表格ID
    rowSelection?: TableRowSelection | undefined
    scroll?: any
    defaultExpandAllRows?: boolean
    printConfig?: any
    sortChange?: any
    paginationLoad?: boolean
    paginationConfig?: any
  }>(),
  {
    total: 0,
    tableData: () => {
      return []
    },
    searchColumns: () => {
      return []
    },
    searchColumnsSpan: 4,
    immediately: true,
    rowKey: 'id',
    rowSelection: undefined,
    scroll: () => {
      return {}
    },
    defaultExpandAllRows: false,
    printConfig: () => {
      return {
        id: 'print-dom', // 这里是要打印元素的ID
        popTitle: '&nbsp', // 打印的标题
        extraCss: '', // 打印可引入外部的一个 css 文件
        extraHead: '', // 打印头部文字
        preview: false, // 是否启动预览模式，默认是false
      }
    },
    paginationLoad: true,
    paginationConfig: () => {},
  },
)

const emits = defineEmits(['loadData', 'sortChange', 'rowClick'])

// 搜索表单是否显示
const searchFormShow = ref(true)

// 搜索表单实例
const SearchFormRef = shallowRef<FormInstance>()

// 表格实例
const DataTableRef = shallowRef<TableInstance>()

// 表格属性
const tableConfig = ref<{
  stripe?: boolean
  bordered?: boolean
  hoverable?: boolean
  size?: 'mini' | 'small' | 'medium' | 'large'
}>({
  stripe: false,
  bordered: false,
  hoverable: false,
  size: 'large',
})

// 表格loading
const loading = defineModel('loading', { default: false, type: Boolean })

// 表单搜索项
const searchParams = defineModel<any>('searchParams', { default: {} })

// 分页配置
const pageNum = defineModel('pageNum', { default: 1 })

const pageSize = defineModel('pageSize', { default: 10 })

// 表格列表配置
const tableColumns = defineModel<TableColumnData[]>('tableColumns', {
  default: [],
})

// 表格选择ID列表
const selectedKeys = defineModel('selectedKeys', { default: [] })

// 展开ID
const expandedKeys = defineModel('expandedKeys', { default: [] })

// 搜索
function handleSearch() {
  emits('loadData')
}

// 重置
function handleReset() {
  SearchFormRef.value?.resetFields()
  pageNum.value = 1
  emits('loadData')
}

// 加载表格数据
function loadData() {
  if (!props.immediately) {
    return
  }
  emits('loadData')
}

loadData()

// 分页
function handlePageChange(page: number) {
  pageNum.value = page
  if (props.paginationLoad) {
    emits('loadData')
  }
}

function handlePageSizeChange(size: number) {
  pageNum.value = 1
  pageSize.value = size
  if (props.paginationLoad) {
    emits('loadData')
  }
}

// 折叠表格
function expandTable(expand: boolean) {
  DataTableRef.value?.expandAll(expand)
}

defineExpose({
  expandTable,
})
</script>

<template>
  <div mb-3 overflow-hidden bg-bg-color-2 px-2>
    <a-form
      v-if="searchFormShow"
      ref="SearchFormRef"
      :model="searchParams"
      auto-label-width
      grid
      mt-5
      gap-x-5
      border="0 b solid border-color-1"
      :style="{
        'grid-template-columns': `repeat(${props.searchColumnsSpan}, minmax(0, 1fr))`,
      }"
    >
      <a-form-item
        v-for="item in searchColumns"
        :key="item.field"
        :label="item.label"
        :field="item.field"
        show-colon
      >
        <template v-if="item.type === 'a-input'">
          <a-input
            v-model="searchParams[item.field]"
            :placeholder="`请输入${item.label}...`"
            allow-clear
            :disabled="item.disabled || false"
          />
        </template>

        <template v-else-if="item.type === 'a-select'">
          <a-select
            v-model="searchParams[item.field]"
            :placeholder="`请选择${item.label}...`"
            allow-clear
            allow-search
            :disabled="item.disabled || false"
            @change="item.onChange"
          >
            <a-option
              v-for="selectItem in item.dictData"
              :key="selectItem[item.dictDataOption?.value ?? 'value']"
              :value="selectItem[item.dictDataOption?.value ?? 'value']"
              :label="selectItem[item.dictDataOption?.label ?? 'label']"
            />
          </a-select>
        </template>

        <template v-else-if="item.type === 'a-range-picker'">
          <a-range-picker
            v-model="searchParams[item.field]"
            allow-clear
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled="item.disabled || false"
            :shortcuts="[
              {
                label: '前一周',
                value: () =>
                  [dayjs(new Date()).subtract(7, 'day'), dayjs()] as any,
              },
              {
                label: '前一个月',
                value: () =>
                  [dayjs(new Date()).subtract(1, 'month'), dayjs()] as any,
              },
              {
                label: '前三个月',
                value: () =>
                  [dayjs(new Date()).subtract(3, 'month'), dayjs()] as any,
              },
            ]"
          />
        </template>
      </a-form-item>
    </a-form>

    <div py-3 space-x-xs>
      <a-button type="primary" @click="handleSearch">
        <template #icon>
          <icon-search />
        </template>
        搜索
      </a-button>

      <a-button @click="handleReset">
        <template #icon>
          <icon-refresh />
        </template>
        重置
      </a-button>
    </div>
  </div>

  <div bg-bg-color-2 p-2>
    <div mb-3 flex items-center justify-between>
      <div space-x-xs>
        <slot name="operateBtns" />
      </div>

      <div space-x-xs>
        <a-tooltip content="隐藏搜索">
          <a-button
            type="dashed"
            shape="circle"
            status="normal"
            @click="searchFormShow = !searchFormShow"
          >
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="刷新">
          <a-button
            type="dashed"
            shape="circle"
            @click="() => emits('loadData')"
          >
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip content="打印表格">
          <a-button v-print="props.printConfig" type="dashed" shape="circle">
            <template #icon>
              <icon-printer />
            </template>
          </a-button>
        </a-tooltip>

        <a-dropdown trigger="hover">
          <a-tooltip content="表格大小">
            <a-button type="dashed" shape="circle">
              <template #icon>
                <icon-translate />
              </template>
            </a-button>
          </a-tooltip>
          <template #content>
            <a-doption @click="tableConfig.size = 'mini'">
              Mini
            </a-doption>
            <a-doption @click="tableConfig.size = 'small'">
              Small
            </a-doption>
            <a-doption @click="tableConfig.size = 'medium'">
              Medium
            </a-doption>
            <a-doption @click="tableConfig.size = 'large'">
              Large
            </a-doption>
          </template>
        </a-dropdown>

        <a-popover trigger="hover" position="bottom">
          <a-button type="dashed" shape="circle">
            <template #icon>
              <icon-list />
            </template>
          </a-button>
          <template #content>
            <div w-280px>
              <div
                flex
                items-center
                pb-2
                space-x-xs
                border="0 b solid border-color-2"
              >
                <a-checkbox v-model="tableConfig.stripe">
                  斑马纹
                </a-checkbox>

                <a-checkbox v-model="tableConfig.bordered">
                  边框
                </a-checkbox>

                <a-checkbox v-model="tableConfig.hoverable">
                  显示选中效果
                </a-checkbox>
              </div>

              <a-scrollbar
                :style="{ 'max-height': '400px', 'overflow-y': 'auto' }"
              >
                <draggable v-model="tableColumns" item-key="dataIndex">
                  <template #item="{ element }">
                    <div mt-3 flex items-center justify-between>
                      <div
                        text="sm text-color-2"
                        flex
                        cursor-move
                        items-center
                        space-x-xs
                      >
                        <icon-drag-arrow />
                        <div>{{ element.title }}</div>
                      </div>

                      <div text="sm text-color-2" flex items-center space-x-xs>
                        <a-tooltip content="悬浮在最左边">
                          <icon-to-left
                            cursor-pointer
                            hover="text-primary-6"
                            transition-all
                            @click="element.fixed = 'left'"
                          />
                        </a-tooltip>

                        <a-tooltip content="悬浮在最右边">
                          <icon-to-right
                            cursor-pointer
                            hover="text-primary-6"
                            transition-all
                            @click="element.fixed = 'right'"
                          />
                        </a-tooltip>
                      </div>
                    </div>
                  </template>
                </draggable>
              </a-scrollbar>
            </div>
          </template>
        </a-popover>
      </div>
    </div>

    <a-table
      id="print-dom"
      ref="DataTableRef"
      v-model:selected-keys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      :size="tableConfig.size"
      :columns="tableColumns"
      :data="props.tableData"
      :sticky-header="0"
      :loading
      :stripe="tableConfig.stripe"
      :bordered="tableConfig.bordered"
      :hoverable="tableConfig.hoverable"
      :pagination="{
        current: pageNum,
        total: props.total,
        pageSize,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
        hideOnSinglePage: true,
        ...props.paginationConfig,
      }"
      :row-key="props.rowKey"
      :row-selection="props.rowSelection"
      :scroll="props.scroll"
      :default-expand-all-rows="props.defaultExpandAllRows"
      @sorter-change="
        (dataIndex: string, direction: string) =>
          emits('sortChange', dataIndex, direction)
      "
      @row-click="
        (record: TableData, ev: Event) => emits('rowClick', record, ev)
      "
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #columns>
        <a-table-column
          v-for="item in tableColumns"
          :key="item.dataIndex"
          :data-index="item.dataIndex"
          :title="item.title as any"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          :align="item.align"
          :ellipsis="item.ellipsis"
          :sortable="item.sortable"
          :tooltip="item.tooltip"
        >
          <template
            v-if="item.slotName && $slots[item.slotName as any]"
            #cell="{ record, column, rowIndex }"
          >
            <slot
              :name="item.slotName"
              :record="record"
              :column="column"
              :row-index="rowIndex"
              :table-config="tableConfig"
            />
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss"></style>
