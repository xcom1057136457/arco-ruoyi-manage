<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import type { IFormParams } from '../types'

defineOptions({
  name: 'OperateDialog',
})

const props = withDefaults(
  defineProps<{
    rowId?: any
    sysNoticeType?: any[]
    sysNoticeStatus?: any[]
  }>(),
  {
    rowId: '',
    sysNoticeType: () => {
      return []
    },
    sysNoticeStatus: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

const formParams = ref<IFormParams>({
  status: '0',
})

const formRules = ref<Record<string, FieldRule>>({
  noticeTitle: { required: true, message: '请输入公告标题!' },
  noticeType: { required: true, message: '请选择公告类型!' },
})

const OperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

// 提交
function handleSubmit() {
  OperateFormRef.value?.validate((errors: any) => {
    if (!errors) {
      loading.value = true
      emits('submit', cloneDeep(formParams.value), () => {
        loading.value = false
      })
    }
  })
}

// 关闭
function handleClose() {
  OperateFormRef.value?.resetFields()
}

defineExpose({
  formParams,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :width="520"
    :title="props.rowId ? '修改公告' : '新增公告'"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form
      ref="OperateFormRef"
      :model="formParams"
      :rules="formRules"
      auto-label-width
    >
      <a-form-item label="公告标题" field="noticeTitle" show-colon>
        <a-input
          v-model="formParams.noticeTitle"
          allow-clear
          placeholder="请输入公告标题..."
        />
      </a-form-item>

      <a-form-item label="公告类型" field="noticeType" show-colon>
        <a-select
          v-model="formParams.noticeType"
          allow-clear
          allow-search
          placeholder="请选择公告类型..."
        >
          <a-option
            v-for="item in props.sysNoticeType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="状态" field="status" show-colon>
        <a-radio-group v-model="formParams.status">
          <a-radio
            v-for="item in props.sysNoticeStatus"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="内容" field="noticeContent" show-colon>
        <rich-edit v-model="formParams.noticeContent" />
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
  </a-drawer>
</template>

<style scoped lang="scss"></style>
