<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
defineOptions({
  name: 'Druid',
})

const iframeUrl = `${import.meta.env.VITE_WEB_BASE_URL}/druid/login.html`
</script>

<template>
  <i-frame :url="iframeUrl" />
</template>

<style scoped lang="scss"></style>
