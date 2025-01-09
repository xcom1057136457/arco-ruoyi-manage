<!-- 由 Dioa 创建于 2024-06-07 星期五 -->
<script setup lang="ts">
import { type FieldRule, Message } from '@arco-design/web-vue'
import {
  getUserProfile,
  updateUserProfile,
  updateUserPwd,
} from '@/api/system/user'

defineOptions({
  name: 'Profile',
})

const router = useRouter()

const { handleCloseCurrent } = useTagViewsStore()

// 基本资料
const baseInfoFormParams = ref<{
  nickName?: any
  phonenumber?: any
  email?: any
  sex?: any
}>({})

const baseInfoFormRules = ref<Record<string, FieldRule | FieldRule[]>>({
  nickName: { required: true, message: '请输入用户昵称!' },
  phonenumber: [
    { required: true, message: '请输入手机号码!' },
    {
      validator(value, callback) {
        if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
          callback()
        }
        else {
          callback('请输入正确的手机号码!')
        }
      },
    },
  ],
  email: { required: true, type: 'email', message: '请输入邮箱!' },
})

// 基本资料保存
const baseInfoLoading = ref(false)

async function handleBaseInfoSubmit({ errors }: any) {
  if (!errors) {
    baseInfoLoading.value = true
    try {
      const { code }: any = await updateUserProfile(baseInfoFormParams.value)
      if (code === 200) {
        Message.success('保存成功!')
        await loadData()
      }
    }
    finally {
      baseInfoLoading.value = false
    }
  }
}

// 加载数据
const userInfo = ref<any>({})

const postName = ref('')

const roleName = ref('')

async function loadData() {
  const { code, data, postGroup, roleGroup }: any = await getUserProfile()
  if (code === 200) {
    userInfo.value = data
    postName.value = postGroup
    roleName.value = roleGroup

    // 填充基本资料数据
    baseInfoFormParams.value = {
      nickName: data?.nickName,
      phonenumber: data?.phonenumber,
      email: data?.email,
      sex: data?.sex,
    }
  }
}

loadData()

// 个人信息数据
const userInfoList = computed(() => {
  return [
    {
      icon: 'i-solar-user-broken',
      label: '用户名称',
      value: userInfo.value?.userName,
    },
    {
      icon: 'i-solar-phone-broken',
      label: '手机号码',
      value: userInfo.value?.phonenumber,
    },
    {
      icon: 'i-solar-mailbox-broken',
      label: '用户邮箱',
      value: userInfo.value?.email,
    },
    {
      icon: 'i-solar-floor-lamp-minimalistic-outline',
      label: '所属部门',
      value: `${userInfo.value?.dept?.deptName} / ${postName.value}`,
    },
    {
      icon: 'i-solar-hiking-round-linear',
      label: '所属角色',
      value: roleName.value,
    },
    {
      icon: 'i-solar-calendar-broken',
      label: '创建日期',
      value: userInfo.value?.createTime,
    },
  ]
})

// 修改密码
const passwordFormParams = ref<{
  oldPassword?: any
  newPassword?: any
  confirmPassword?: any
}>({})

const passwordFormRules = ref<Record<string, FieldRule | FieldRule[]>>({
  oldPassword: { required: true, message: '请输入旧密码!' },
  newPassword: [
    { required: true, message: '请输入新密码!' },
    { minLength: 6, maxLength: 20, message: '长度在 6 到 20 个字符' },
    {
      validator(value, callback) {
        if (/^[^<>"'|\\]+$/.test(value)) {
          callback()
        }
        else {
          callback('不能包含非法字符：< > \\" \' \\\\\\ |')
        }
      },
    },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码!' },
    {
      validator(value, callback) {
        if (value === passwordFormParams.value.newPassword) {
          callback()
        }
        else {
          callback('两次输入的密码不一致!')
        }
      },
    },
  ],
})

const passwordLoading = ref(false)

async function handlePasswordSubmit({ errors }: any) {
  if (!errors) {
    passwordLoading.value = true
    try {
      const { code }: any = await updateUserPwd(
        passwordFormParams.value.oldPassword,
        passwordFormParams.value.newPassword,
      )
      if (code === 200) {
        Message.success('修改成功!')
        router.go(0)
      }
    }
    finally {
      passwordLoading.value = false
    }
  }
}
</script>

<template>
  <div flex gap-x-5>
    <div flex="[0_0_400px]" bg-bg-color-2>
      <div flex items-center gap-x-2 p-3 text-text-color-1 font-semibold>
        <div i-solar-user-bold-duotone text-xl />
        <div text-sm>
          个人信息
        </div>
      </div>

      <div
        border="0 y solid border-color-2"
        flex
        cursor-pointer
        items-center
        justify-center
        p-3
      >
        <div relative class="group">
          <svg-icon
            :icon-class="userInfo.sex === '1' ? 'avatar-girl' : 'avatar-man'"
            text-150px
          />

          <div
            bg="black/20"
            text="white xl"
            absolute
            inset-0
            hidden
            flex
            items-center
            justify-center
            rounded-full
            group-hover="flex"
          >
            <icon-plus />
          </div>
        </div>
      </div>

      <div py-3 space-y-sm>
        <div
          v-for="(item, index) in userInfoList"
          :key="index"
          flex
          items-center
          justify-between
          px-3
          text="text-color-2 sm"
        >
          <div flex items-center gap-x-3>
            <div :class="item.icon" />
            <div>{{ item.label }}</div>
          </div>

          <div>{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div flex-1 bg-bg-color-2>
      <div
        border="0 b solid border-color-2"
        flex
        items-center
        gap-x-2
        p-3
        text-text-color-1
        font-semibold
      >
        <div i-solar-align-left-broken text-xl />
        <div text-sm>
          基本资料
        </div>
      </div>

      <div>
        <a-tabs default-active-key="1" animation>
          <a-tab-pane key="1" title="基本资料">
            <a-form
              :model="baseInfoFormParams"
              :rules="baseInfoFormRules"
              auto-label-width
              box-border
              px-3
              @submit="handleBaseInfoSubmit"
            >
              <a-form-item label="用户昵称" field="nickName" show-colon>
                <a-input
                  v-model="baseInfoFormParams.nickName"
                  allow-clear
                  placeholder="请输入用户昵称..."
                  :max-length="30"
                />
              </a-form-item>

              <a-form-item label="手机号码" field="phonenumber" show-colon>
                <a-input
                  v-model="baseInfoFormParams.phonenumber"
                  allow-clear
                  placeholder="请输入手机号码..."
                  :max-length="11"
                />
              </a-form-item>

              <a-form-item label="邮箱" field="email" show-colon>
                <a-input
                  v-model="baseInfoFormParams.email"
                  allow-clear
                  placeholder="请输入邮箱..."
                  :max-length="50"
                />
              </a-form-item>

              <a-form-item label="性别" field="sex" show-colon>
                <a-radio-group v-model="baseInfoFormParams.sex">
                  <a-radio value="0">
                    男
                  </a-radio>
                  <a-radio value="1">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item>
                <div space-x-xs>
                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="baseInfoLoading"
                  >
                    保存
                  </a-button>

                  <a-button @click="handleCloseCurrent()">
                    关闭
                  </a-button>
                </div>
              </a-form-item>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="2" title="修改密码">
            <a-form
              :model="passwordFormParams"
              :rules="passwordFormRules"
              auto-label-width
              box-border
              px-3
              @submit="handlePasswordSubmit"
            >
              <a-form-item label="旧密码" field="oldPassword">
                <a-input-password
                  v-model="passwordFormParams.oldPassword"
                  allow-clear
                  placeholder="请输入旧密码..."
                />
              </a-form-item>

              <a-form-item label="新密码" field="newPassword">
                <a-input-password
                  v-model="passwordFormParams.newPassword"
                  allow-clear
                  placeholder="请输入新密码..."
                />
              </a-form-item>

              <a-form-item label="确认密码" field="confirmPassword">
                <a-input-password
                  v-model="passwordFormParams.confirmPassword"
                  allow-clear
                  placeholder="请输入确认密码..."
                />
              </a-form-item>

              <a-form-item>
                <div space-x-xs>
                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="passwordLoading"
                  >
                    保存
                  </a-button>

                  <a-button @click="handleCloseCurrent()">
                    关闭
                  </a-button>
                </div>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
