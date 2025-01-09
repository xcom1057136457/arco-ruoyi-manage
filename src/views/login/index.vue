<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script lang="ts" setup>
import Cookies from 'js-cookie'
import { Message } from '@arco-design/web-vue'
import { getCaptureCode } from '@/api/login'
import { decrypt, encrypt } from '@/utils/jsencrypt'

defineOptions({
  name: 'Login',
})

const { login } = useUserStore()

const router = useRouter()

const route = useRoute()

const loginFormParams = ref<{
  username: string
  password: string
  code?: any
  uuid?: string
  rememberme?: boolean
}>({
  username: '',
  password: '',
  code: null,
  uuid: '',
  rememberme: false,
})

const loginFormRules = {
  username: { required: true, message: '请输入用户名!' },
  password: { required: true, message: '请输入密码!' },
  code: { required: true, message: '请输入验证码!' },
}

// 获取验证码
const codeUrl = ref('')

async function getCaptchaCode() {
  const { code, img, uuid }: any = await getCaptureCode()
  if (code === 200) {
    codeUrl.value = `data:image/gif;base64,${img}`
    loginFormParams.value.uuid = uuid
  }
}

getCaptchaCode()

// 登录
const loginLoading = ref(false)

async function handleLogin({ errors }: any) {
  if (!errors) {
    loginLoading.value = true
    try {
      if (loginFormParams.value.rememberme) {
        Cookies.set('arco-design-username', loginFormParams.value.username, {
          expires: 30,
        })
        Cookies.set('arco-design-password', encrypt(loginFormParams.value.password), {
          expires: 30,
        })
        Cookies.set('arco-design-rememberme', String(loginFormParams.value.rememberme), {
          expires: 30,
        })
      }
      else {
        Cookies.remove('arco-design-username')
        Cookies.remove('arco-design-password')
        Cookies.remove('arco-design-rememberme')
      }
      await login(loginFormParams.value)
      await router.push((route.query?.redirectUrl as string) || '/')
      Message.success('登录成功!')
    }
    catch (e) {
      await getCaptchaCode()
    }
    finally {
      loginLoading.value = false
    }
  }
}

// 从Cookie中获取账号
function getAccountFromCookie() {
  const username = Cookies.get('arco-design-username') || ''
  const password = Cookies.get('arco-design-password') || ''
  const rememberme = Cookies.get('arco-design-rememberme')
    ? Boolean(Cookies.get('arco-design-rememberme'))
    : false
  loginFormParams.value = {
    username,
    password: password ? decrypt(password) : '',
    rememberme,
  }
}

getAccountFromCookie()
</script>

<template>
  <div h-full w-full flex>
    <div flex-1>
      <img
        block
        h-full
        w-full
        object-cover
        src="https://picgo-dioa.oss-cn-beijing.aliyuncs.com/202402261331763.png"
        alt="login bg"
      >
    </div>

    <div
      flex="[0_0_450px] ~ col"
      relative
      box-border
      justify-center
      bg="bg-color-1"
      px-7
    >
      <div text="xl text-color-1" mb-3 flex items-center font-bold space-x-xs>
        <div>欢迎来到 Arco Ruoyi Manage</div>
        <div i-unjs-giget text-2xl />
      </div>

      <div text="sm text-color-3" mb-7>
        当没有人懂你的时候.你要学会长大.独自一人抵挡千军万马.
      </div>

      <a-form
        :model="loginFormParams"
        :label-col-props="{ span: 0 }"
        :wrapper-col-props="{ span: 24 }"
        :rules="loginFormRules"
        size="large"
        @submit="handleLogin"
      >
        <a-form-item field="username">
          <a-input
            v-model="loginFormParams.username"
            placeholder="用户名"
            allow-clear
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="password">
          <a-input-password
            v-model="loginFormParams.password"
            placeholder="密码"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item field="code">
          <div w-full flex items-center space-x-xs>
            <a-input-number
              v-model="loginFormParams.code"
              placeholder="验证码"
              allow-clear
              hide-button
            >
              <template #prefix>
                <icon-safe />
              </template>
            </a-input-number>

            <div
              h-38px
              flex="[0_0_120px]"
              overflow-hidden
              @click="getCaptchaCode"
            >
              <img
                h-full
                w-full
                cursor-pointer
                :src="codeUrl"
                alt="captcha image"
              >
            </div>
          </div>
        </a-form-item>

        <a-form-item field="rememberme">
          <a-checkbox v-model="loginFormParams.rememberme">
            记住账户
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            html-type="submit"
            type="primary"
            long
            :loading="loginLoading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
