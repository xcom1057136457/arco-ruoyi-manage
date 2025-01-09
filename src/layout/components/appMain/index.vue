<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
defineOptions({
  name: 'AppMain',
})

const { cacheViews } = storeToRefs(useCacheViewsStore())
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cacheViews">
      <component :is="Component" :key="route.path" />
    </keep-alive>
  </router-view>
</template>

<style scoped lang="scss"></style>
