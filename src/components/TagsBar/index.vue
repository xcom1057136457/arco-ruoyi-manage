<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
defineOptions({
  name: 'TagsBar',
})

const { tagsList } = storeToRefs(useTagViewsStore())

const {
  handlePageRemove,
  handleCloseCurrent,
  handleCloseOther,
  handleCloseAll,
} = useTagViewsStore()

const route = useRoute()

const router = useRouter()

const editableTabsValue = ref<any>('')

watch(
  () => route,
  (val: any) => {
    if (val.meta?.showTag === false) {
      return
    }
    editableTabsValue.value = val.path
    setTimeout(() => {
      if (!tagsList.value.map((item: any) => item.path).includes(val.path)) {
        tagsList.value.push({
          path: val.path,
          title: val.meta?.title,
          closeable: true,
        })
      }
    })
  },
  { immediate: true, deep: true },
)

function handlePageChange(path: any) {
  router.push(path)
}
</script>

<template>
  <div flex bg="[var(--color-bg-2)]">
    <div box-border flex-1 overflow-x-auto>
      <a-tabs
        v-model:active-key="editableTabsValue"
        class="w-full"
        editable
        auto-switch
        hide-content
        @tab-click="handlePageChange"
        @delete="handlePageRemove"
      >
        <a-tab-pane
          v-for="item in tagsList"
          :key="item.path"
          :name="item.path"
          :closable="item.closeable"
          :title="item.title"
        />
      </a-tabs>
    </div>

    <a-dropdown trigger="hover">
      <div
        border="0 b l solid border-color-2"
        z-10
        flex
        cursor-pointer
        items-center
        justify-center
        bg="bg-color-2"
        text="text-color-1"
        hover="text-primary-6"
        px-2
        transition-all
      >
        <icon-apps />
      </div>
      <template #content>
        <a-doption
          :disabled="route.path === '/dashboard'"
          @click="handleCloseCurrent()"
        >
          关闭当前
        </a-doption>
        <a-doption @click="handleCloseOther">
          关闭其他
        </a-doption>
        <a-doption @click="handleCloseAll">
          关闭所有
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<style scoped lang="scss"></style>
