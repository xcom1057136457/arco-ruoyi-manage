<!-- 由 Dioa 创建于 2024-05-30 星期四 -->
<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'

defineOptions({
  name: 'ResetPasswordDialog',
})

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false, type: Boolean })

const username = ref('')

const formParams = ref<{
  password: any
}>({
  password: '',
})

const formRules = ref<Record<string, FieldRule[]>>({
  password: [
    { required: true, message: '请输入新密码!' },
    {
      minLength: 5,
      maxLength: 20,
      message: '用户密码长度必须介于 5 和 20 之间!',
    },
  ],
})

const ResetPasswordFormRef = shallowRef<FormInstance>()

const loading = ref(false)

function handleSubmit() {
  ResetPasswordFormRef.value?.validate((errors: any) => {
    if (!errors) {
      loading.value = true
      emits('submit', cloneDeep(formParams.value), () => {
        loading.value = false
      })
    }
  })
}

function handleClose() {
  ResetPasswordFormRef.value?.resetFields()
  loading.value = false
}

defineExpose({
  username,
})
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="重置密码"
    unmount-on-close
    :mask-closable="false"
    :width="500"
    @close="handleClose"
  >
    <a-form
      ref="ResetPasswordFormRef"
      :model="formParams"
      :rules="formRules"
      auto-label-width
      layout="vertical"
    >
      <a-form-item
        :label="`请输入&quot;${username}&quot;的新密码`"
        field="password"
        hide-asterisk
      >
        <a-input
          v-model="formParams.password"
          allow-clear
          placeholder="请输入新密码..."
          :input-attrs="{
            autofocus: true,
          }"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button @click="visible = false">
        取消
      </a-button>
      <a-button type="primary" :loading @click="handleSubmit">
        确认
      </a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="scss"></style>
