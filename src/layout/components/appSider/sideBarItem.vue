<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import appLink from './link.vue'
import sideBarItem from './sideBarItem.vue'
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/utils'

defineOptions({
  name: 'SideBarItem',
})

const props = withDefaults(
  defineProps<{
    item?: any
    isNest?: boolean
    basePath?: string
  }>(),
  {
    item: {},
    isNest: false,
    basePath: '',
  },
)

const onlyOneChild = ref<any>({})

function hasOneShowingChild(children = [], parent?: any) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item: any) => {
    if (item.hidden) {
      return false
    }
    // Temp set(will be used if only has one showing child)
    onlyOneChild.value = item
    return true
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

function resolvePath(routePath?: any, routeQuery?: any) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    const query = JSON.parse(routeQuery)
    return {
      path: getNormalPath(`${props.basePath}/${routePath}`),
      query,
    }
  }
  return getNormalPath(`${props.basePath}/${routePath}`)
}
</script>

<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item)
          && (!onlyOneChild.children || onlyOneChild.noShowingChildren)
          && !item.alwaysShow
      "
    >
      <app-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <a-menu-item
          :key="resolvePath(onlyOneChild.path)"
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <svg-icon
            mr-2 text-base
            :icon-class="
              onlyOneChild.meta.icon || (item.meta && item.meta.icon)
            "
          />
          <span>
            {{ item.meta ? item.meta.title : item.children[0].meta.title }}
          </span>
        </a-menu-item>
      </app-link>
    </template>

    <a-sub-menu
      v-else
      :key="item.path"
      :index="resolvePath(item.path)"
    >
      <template v-if="item.meta" #title>
        <svg-icon mr-2 text-base :icon-class="item.meta && item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <side-bar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </a-sub-menu>
  </div>
</template>

<style scoped lang="scss">

</style>
