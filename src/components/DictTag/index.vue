<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
defineOptions({
  name: 'DictTag',
})

const props = withDefaults(
  defineProps<{
    value: any
    options: any
    isString?: boolean
  }>(),
  {
    value: [],
    options: () => {
      return []
    },
    isString: false,
  },
)

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  }
  return []
})

function fColor(type: string) {
  if (!type) {
    return ''
  }
  const colorObj: any = {
    primary: () => {
      return 'blue'
    },
    danger: () => {
      return 'red'
    },
    success: () => {
      return 'green'
    },
    info: () => {
      return 'gray'
    },
    warning: () => {
      return 'orangered'
    },
  }
  if (colorObj[type]) {
    return colorObj[type]()
  }
}
</script>

<template>
  <div>
    <template v-for="item in options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="
            props.isString
              || item.elTagType === 'default'
              || item.elTagType === ''
          "
          :key="item.value"
          :class="item.elTagClass"
        >{{ item.label }}</span>

        <a-tag
          v-else
          :key="`${item.value}`"
          :color="item.elTagType ? fColor(item.elTagType) : 'arcoblue'"
          :class="item.elTagClass"
        >
          {{ item.label }}
        </a-tag>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
