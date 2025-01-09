<script setup lang="ts">
const { loading, loadingText } = storeToRefs(useLoadingStore())
</script>

<template>
  <a-spin :loading="loading" :tip="loadingText" dot h-full w-full>
    <RouterView />
  </a-spin>
</template>

<style scoped></style>
