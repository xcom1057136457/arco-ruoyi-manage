<script lang="ts" setup>
const message = computed(() => {
  return '找不到网页！'
})

const router = useRouter()
</script>

<template>
  <div left="50%" top="40%" translate-x="-1/2" translate-y="-1/2" absolute>
    <div class="wscn-http404" relative w-1200px overflow-hidden p="x-50px y-0">
      <div class="pic-404" relative float-left w-600px overflow-hidden>
        <img
          class="pic-404__parent"
          w-full
          src="@/assets/404_images/404.png"
          alt="404"
        >
        <img
          class="left pic-404__child"
          absolute
          left-220px
          top-17px
          w-80px
          opacity-0
          src="@/assets/404_images/404_cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child mid"
          absolute
          left-420px
          top-10px
          w-46px
          opacity-0
          src="@/assets/404_images/404_cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child right"
          absolute
          left-500px
          top-100px
          w-62px
          opacity-0
          src="@/assets/404_images/404_cloud.png"
          alt="404"
        >
      </div>
      <div
        class="bullshit"
        relative
        float-left
        w-300px
        overflow-hidden
        p="x-0 y-30px"
      >
        <div
          class="bullshit__oops"
          mb-20px
          text="32px primary-6"
          font-bold
          leading-10
          opacity-0
        >
          404错误!
        </div>
        <div
          class="bullshit__headline"
          mb-10px
          text="xl #222"
          font-bold
          leading-6
          opacity-0
        >
          {{ message }}
        </div>
        <div
          class="bullshit__info"
          mb-30px
          text="13px gray-900"
          leading-21px
          opacity-0
        >
          对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
        </div>
        <div
          class="bullshit__return-home"
          bg-primary-6
          float-left
          block
          h-9
          w-110px
          cursor-pointer
          rounded-100px
          leading-9
          no-underline
          opacity-0
          text="center sm white"
          @click="() => router.push('/dashboard')"
        >
          返回首页
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wscn-http404 {
  .pic-404 {
    &__child {
      &.left {
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    &__oops {
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
