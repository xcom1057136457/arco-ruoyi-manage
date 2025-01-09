<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-vue/es/icon'
import { Message, Modal } from '@arco-design/web-vue'

defineOptions({
  name: 'AppHeader',
  components: {
    IconMenuUnfold,
    IconMenuFold,
  },
})

const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: '',
})

const changeDark = useToggle(isDark)

function toggleTheme(event: any) {
  const x = event.clientX // 表示鼠标事件在窗口中的水平位置，即鼠标指针距离窗口左边界的距离。
  const y = event.clientY // 表示鼠标事件在窗口中的垂直位置，即鼠标指针距离窗口上边界的距离。

  /**
   * 1. `Math.hypot()`方法计算了鼠标事件位置到窗口边界的最远距离。
   * 2. `Math.hypot()`方法会计算这两个距离的直角三角形的斜边长度，即最远距离。
   */
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x), // `Math.max(x, innerWidth - x)`会返回x的值和窗口宽度减去x的值中的较大值，即表示鼠标事件到窗口水平边界的最远距离
    Math.max(y, innerHeight - y), // 同样，`Math.max(y, innerHeight - y)`表示鼠标事件到窗口垂直边界的最远距离
  )

  // 兼容性处理   //如果项目+ts文件的话  使用@ts-expect-error 忽略startViewTransition
  // @ts-expect-error 123
  if (!document.startViewTransition) {
    changeDark()
    return
  }
  // 使用了`document.startViewTransition()`方法来开始一个异步的视图过渡。
  // @ts-expect-error 123
  const transition = document.startViewTransition(async () => {
    changeDark() // 切换暗黑模式的状态
  })
  // 这是一个异步函数调用，表示在页面过渡准备就绪后执行下面的代码。
  transition.ready.then(() => {
    // 定义了一个数组`clipPath`，其中包含两个元素，分别是裁剪路径的起始状态和结束状态。
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    // 这是一个动画效果的实现，通过改变`clipPath`属性的值来实现动画效果。`document.documentElement`表示整个HTML文档的根元素。
    document.documentElement.animate(
      {
        // 这里根据`isDark.value`的值来确定裁剪路径的动画效果。如果`isDark.value`为真，则将`clipPath`数组进行反转，实现从结束状态到起始状态的动画效果。
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400, // 动画的持续时间为400毫秒。
        easing: 'ease-in', // 动画的缓动函数，表示动画开始时加速。

        // 这是一个伪元素选择器，根据`isDark.value`的值选择不同的伪元素。伪元素选择器可以用于在指定元素的前面或后面插入内容。
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}

const { isFullscreen, toggle } = useFullscreen()

const router = useRouter()

const route = useRoute()

const collapsed = defineModel('collapsed')

const { userInfo, logout } = useUserStore()

// 查看用户信息
function handleViewUserInfo() {
  router.push({
    name: 'Profile',
  })
}

// 退出登录
function handleLogout() {
  Modal.confirm({
    title: '系统通知',
    content: '是否退出登录?',
    titleAlign: 'start',
    async onOk() {
      await logout()
      await router.push({
        path: '/login',
        query: {
          redirectUrl: route.fullPath,
        },
      })
      Message.success('退出成功!')
    },
  })
}
</script>

<template>
  <div
    z-10
    h-40px
    border="0 b solid border-color-1"
    flex
    justify-between
    bg="bg-color-2"
  >
    <div flex items-center space-x-xs>
      <div
        class="hover:text-primary-6"
        ml-3
        flex
        cursor-pointer
        items-center
        text="lg text-color-1"
        transition-all
      >
        <component
          :is="collapsed ? 'icon-menu-unfold' : 'icon-menu-fold'"
          @click="collapsed = !collapsed"
        />
      </div>

      <bread-crumb />
    </div>

    <div flex items-center space-x-5px>
      <a-tooltip content="锁定屏幕">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
        >
          <icon-lock />
        </div>
      </a-tooltip>

      <a-tooltip content="全屏">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
          @click="toggle"
        >
          <icon-fullscreen v-if="!isFullscreen" />
          <icon-fullscreen-exit v-else />
        </div>
      </a-tooltip>

      <a-tooltip content="暗黑模式">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
          @click="toggleTheme"
        >
          <icon-sun v-if="isDark" />
          <icon-moon v-else />
        </div>
      </a-tooltip>

      <a-tooltip content="配置设置">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
        >
          <icon-settings />
        </div>
      </a-tooltip>

      <a-tooltip content="修改密码">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
        >
          <div i-material-symbols-key-vertical-outline />
        </div>
      </a-tooltip>

      <a-tooltip content="用户信息">
        <div
          text="base text-color-2"
          h-32px
          w-32px
          flex
          cursor-pointer
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          hover="bg-fill-color-2"
          @click="handleViewUserInfo"
        >
          <div i-material-symbols-account-circle-full />
        </div>
      </a-tooltip>

      <div
        border="0 b solid border-color-1"
        box-border
        h-10
        flex
        cursor-pointer
        items-center
        bg-fill-color-1
        px-4
        transition-all
        duration-300
        hover="bg-fill-color-2"
        @click="handleLogout"
      >
        <svg-icon
          :icon-class="userInfo.sex === '1' ? 'avatar-girl' : 'avatar-man'"
          text-30px
        />
        <span ml-3 font-semibold text="text-color-3 13px">
          {{ userInfo.nickName }}
        </span>
        <icon-export ml-3 text="text-color-3 base" />
      </div>
    </div>
  </div>

  <tags-bar />
</template>

<style scoped lang="scss"></style>
