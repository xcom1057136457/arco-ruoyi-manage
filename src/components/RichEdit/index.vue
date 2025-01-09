<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

defineOptions({
  name: 'RichEdit',
})

const props = withDefaults(defineProps<{
  height?: number
}>(), {
  height: 250,
})

const modelValue = defineModel<any>()
</script>

<template>
  <div w-full :style="{ height: `${props.height}px` }">
    <QuillEditor
      v-model:content="modelValue"
      theme="snow"
      content-type="html"
      placeholder="请输入内容..."
    />
  </div>
</template>

<style scoped lang="scss"></style>
