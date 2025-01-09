<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import sideBarItem from './sideBarItem.vue'

defineOptions({
  name: 'AppSider',
})

const collapsed = defineModel('collapsed')

const route = useRoute()

const { sidebarRouters } = usePermissionStore()

const activeMenu = ref<any[]>([])

watch(
  route,
  () => {
    if (route.meta?.activeMenu) {
      activeMenu.value = [route.meta?.activeMenu]
      return
    }
    activeMenu.value = [route.path]
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div h-full flex="~ col">
    <router-link
      v-if="!collapsed"
      box-border
      h-70px
      flex
      cursor-pointer
      items-center
      justify-center
      py-1
      no-underline
      to="/"
    >
      <svg-icon icon-class="arco-design-logo" text="130px white" h-22px />
    </router-link>

    <a-scrollbar style="height: calc(100vh - 70px); overflow: auto;">
      <a-menu
        v-model:selected-keys="activeMenu"
        v-model:collapsed="collapsed"
        theme="dark"
        accordion
        auto-scroll-into-view
        auto-open-selected
        :popup-max-height="false"
      >
        <side-bar-item
          v-for="(item, index) in sidebarRouters as any"
          :key="`${item.path}_${index}`"
          :item="item"
          :base-path="item.path"
        />
      </a-menu>
    </a-scrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
