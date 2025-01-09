<script lang="ts" setup>
import { isExternal } from '@/utils/validate'

const props = withDefaults(
  defineProps<{
    to: any
  }>(),
  {
    to: '',
  },
)

const isExt = computed(() => {
  return isExternal(props.to)
})

const type = computed(() => {
  if (isExt.value) {
    return 'a'
  }
  return 'router-link'
})

function linkProps() {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: props.to,
  }
}
</script>

<template>
  <component :is="type" v-bind="linkProps()" no-underline>
    <slot />
  </component>
</template>
