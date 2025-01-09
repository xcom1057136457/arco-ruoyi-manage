<script lang="ts" setup>
defineOptions({
  name: 'BreadCrumb',
})

const route = useRoute()

const router = useRouter()

const levelList = ref<any>([])

function getBreadcrumb() {
  // only show routes with meta.title
  let matched: any = route.matched.filter(
    item => item.meta && item.meta.title,
  )
  const first = matched[0]
  // 判断是否为首页
  if (!isDashboard(first)) {
    matched = [
      { path: '/dashboard', meta: { title: '数据舱', icon: 'dashboard' } },
    ].concat(matched)
  }

  levelList.value = matched.filter(
    (item: any) =>
      item.meta && item.meta.title && item.meta.breadcrumb !== false,
  )
}

function isDashboard(route: any) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Dashboard'
}

function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
</script>

<template>
  <a-breadcrumb inline-block text-sm separator="/">
    <a-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
      <div flex items-center>
        <svg-icon mr-2 text-sm :icon-class="item.meta && item.meta.icon" />
        <span
          v-if="
            item.redirect === 'noRedirect' || index === levelList.length - 1
          "
          cursor-text
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </div>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style lang="scss" scoped></style>
