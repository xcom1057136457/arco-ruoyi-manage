<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script lang="ts" setup>
import appMain from './components/appMain/index.vue'
import appSider from './components/appSider/index.vue'
import appHeader from './components/appHeader/index.vue'

defineOptions({
  name: 'DefaultLayout',
})

const collapsed = ref(false)

const route = useRoute()

const { userInfo } = useUserStore()

const { addCacheViews } = useCacheViewsStore()

watch(
  route,
  () => {
    addCacheViews(route)
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <a-watermark h-full :content="[userInfo.nickName || '', userInfo.phonenumber || '']">
    <a-layout h-full>
      <a-layout-sider :collapsed theme="dark" :width="220">
        <app-sider v-model:collapsed="collapsed" />
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <app-header v-model:collapsed="collapsed" />
        </a-layout-header>
        <a-layout-content id="layout-content" overflow-x-hidden overflow-y-auto p-3>
          <app-main />
          <a-back-top
            absolute
            bottom-50px
            right-50px
            target-container="#layout-content"
          />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-watermark>
</template>

<style lang="scss" scoped></style>
