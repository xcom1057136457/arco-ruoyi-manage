<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import type { TableColumnData, TableData } from '@arco-design/web-vue'
import { getCacheValue, listCacheKey, listCacheName } from '@/api/monitor/cache'

defineOptions({
  name: 'CacheList',
})

const nowCacheName = ref('')

// 加载缓存列表
const cacheList = ref([])

const cacheListColumns = ref<TableColumnData[]>([
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
    width: 60,
  },
  {
    title: '缓存名称',
    dataIndex: 'cacheName',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
    fixed: 'right',
    width: 100,
  },
])

const cacheListLoading = ref(false)

async function loadCacheList() {
  cacheListLoading.value = true
  try {
    const { code, data }: any = await listCacheName()
    if (code === 200) {
      cacheList.value = data
    }
  }
  finally {
    cacheListLoading.value = false
  }
}

loadCacheList()

// 获取键名列表
const keyListLoading = ref(false)

const keyList = ref([])

const keyListColumns = ref<TableColumnData[]>([
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
    width: 60,
  },
  {
    title: '缓存键名',
    dataIndex: 'cacheKey',
    slotName: 'cacheKey',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    slotName: 'operate',
    fixed: 'right',
    width: 100,
  },
])

const cacheValue = ref<any>({})

async function handleGetCacheKeys(record: TableData) {
  cacheValue.value = []

  keyListLoading.value = true

  try {
    const { code, data }: any = await listCacheKey(record?.cacheName)
    if (code === 200) {
      keyList.value = data
      nowCacheName.value = record?.cacheName
    }
  }
  finally {
    keyListLoading.value = false
  }
}

// 键名前缀去除
function keyFormatter(cacheKey: any) {
  return cacheKey.replace(nowCacheName.value, '')
}

// 获取缓存内容
async function handleGetCacheValue(cacheKey: any) {
  const { code, data }: any = await getCacheValue(nowCacheName.value, cacheKey)
  if (code === 200) {
    cacheValue.value = data
  }
}
</script>

<template>
  <div grid="~ cols-3" gap-x-3>
    <div bg-bg-color-2>
      <div
        flex
        items-center
        justify-between
        text="text-color-2"
        p="x-3 y-3"
        border="0 b solid border-color-2"
      >
        <div flex items-center gap-x-2>
          <div i-solar-hamburger-menu-bold-duotone text-xl />
          <div text-sm>
            缓存列表
          </div>
        </div>

        <div i-solar-refresh-bold cursor-pointer text-primary-6 />
      </div>

      <div p-3>
        <a-table
          :data="cacheList"
          :columns="cacheListColumns"
          :pagination="false"
          :loading="cacheListLoading"
          @row-click="handleGetCacheKeys"
        >
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>

          <template #operate>
            <a-link status="danger">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-link>
          </template>
        </a-table>
      </div>
    </div>

    <div bg-bg-color-2>
      <div
        flex
        items-center
        justify-between
        text="text-color-2"
        p="x-3 y-3"
        border="0 b solid border-color-2"
      >
        <div flex items-center gap-x-2>
          <div i-solar-key-minimalistic-bold-duotone text-xl />
          <div text-sm>
            键名列表
          </div>
        </div>

        <div i-solar-refresh-bold cursor-pointer text-primary-6 />
      </div>

      <div p-3>
        <a-table
          :data="keyList"
          :columns="keyListColumns"
          :loading="keyListLoading"
          :pagination="{
            total: keyList.length,
            pageSize: 15,
            hideOnSinglePage: true,
            showTotal: true,
            simple: true,
          }"
          @row-click="handleGetCacheValue"
        >
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>

          <template #cacheKey="{ record }">
            {{ keyFormatter(record) }}
          </template>

          <template #operate>
            <a-link status="danger">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-link>
          </template>
        </a-table>
      </div>
    </div>

    <div bg-bg-color-2>
      <div
        flex
        items-center
        justify-between
        text="text-color-2"
        p="x-3 y-3"
        border="0 b solid border-color-2"
      >
        <div flex items-center gap-x-2>
          <div i-solar-book-bold-duotone text-xl />
          <div text-sm>
            缓存内容
          </div>
        </div>

        <div i-solar-refresh-bold cursor-pointer text-primary-6 />
      </div>

      <div p-3>
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="缓存名称">
            {{ cacheValue?.cacheName }}
          </a-descriptions-item>

          <a-descriptions-item label="缓存键名">
            {{ cacheValue?.cacheKey }}
          </a-descriptions-item>

          <a-descriptions-item label="缓存内容">
            {{ cacheValue?.cacheValue }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
