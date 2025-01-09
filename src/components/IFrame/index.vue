<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
defineOptions({
  name: 'IFrame',
})

const props = withDefaults(
  defineProps<{
    url: string
  }>(),
  {
    url: '',
  },
)

const loading = ref(true)

function handleIframeLoaded() {
  loading.value = false
}

onUnmounted(() => {
  loading.value = true
})

onDeactivated(() => {
  loading.value = true
})
</script>

<template>
  <a-spin :loading tip="加载页面中..." dot w-full h="[calc(100vh-24px-84px)]">
    <iframe
      h-full
      w-full
      :src="props.url"
      frameborder="no"
      scrolling="auto"
      @load="handleIframeLoaded"
    />
  </a-spin>
</template>

<style scoped lang="scss"></style>
