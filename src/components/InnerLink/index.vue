<script lang="ts" setup>
defineOptions({
  name: 'InnerLink',
})

const props = withDefaults(
  defineProps<{
    src: string
    iframeId: string
  }>(),
  {
    src: '/',
  },
)

const height = ref(`${document.documentElement.clientHeight - 94.5}px`)
</script>

<template>
  <div :style="`height:${height}`">
    <iframe
      :id="props.iframeId"
      class="h-full w-full"
      :src="props.src"
      frameborder="no"
    />
  </div>
</template>
