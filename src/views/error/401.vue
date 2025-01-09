<script lang="ts" setup>
import errImage from '@/assets/401_images/401.gif'

const route = useRoute()

const router = useRouter()

const errGif = ref(`${errImage}?${+new Date()}`)

function back() {
  if (route.query.noGoBack) {
    router.push({ path: '/' })
  }
  else {
    router.go(-1)
  }
}
</script>

<template>
  <div class="errPage-container" m="x-auto y-100px" max-w-full w-800px>
    <a-button
      icon="arrow-left"
      class="pan-back-btn"
      border-none
      bg="!#008489"
      text="!white"
      @click="back"
    >
      返回
    </a-button>
    <a-row>
      <a-col :span="12">
        <h1 class="text-jumbo text-ginormous" text="60px #484848" font-bold>
          401错误!
        </h1>
        <h2>您没有访问权限！</h2>
        <h6>对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
        <ul text-sm class="list-unstyled">
          <li pb-5px class="link-type">
            <div
              text="#008489"
              no-underline
              @click="() => router.push('/dashboard')"
            >
              回首页
            </div>
          </li>
        </ul>
      </a-col>
      <a-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        >
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped></style>
