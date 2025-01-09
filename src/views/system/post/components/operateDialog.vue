<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
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
    sysNormalDisable?: any[]
  }>(),
  {
    rowId: '',
    sysNormalDisable: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

const formParams = ref<IFormParams>({
  postSort: 0,
  status: '0',
})

const formRules = ref<Record<string, FieldRule>>({
  postName: { required: true, message: '请输入岗位名称!' },
  postCode: { required: true, message: '请输入岗位编码!' },
  postSort: { required: true, type: 'number', message: '请输入岗位顺序!' },
})

const OperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

// 表单提交
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

// 弹窗关闭回调
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
    :title="props.rowId ? '修改岗位' : '新增岗位'"
    :width="500"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form ref="OperateFormRef" :model="formParams" :rules="formRules" auto-label-width>
      <a-form-item label="岗位名称" field="postName" show-colon>
        <a-input
          v-model="formParams.postName"
          allow-clear
          placeholder="请输入岗位名称..."
        />
      </a-form-item>

      <a-form-item label="岗位编码" field="postCode" show-colon>
        <a-input
          v-model="formParams.postCode"
          allow-clear
          placeholder="请输入岗位编码..."
        />
      </a-form-item>

      <a-form-item label="岗位顺序" field="postSort" show-colon>
        <a-input-number
          v-model="formParams.postSort"
          allow-clear
          hide-button
          placeholder="请输入岗位顺序..."
        />
      </a-form-item>

      <a-form-item label="岗位状态" field="status" show-colon>
        <a-radio-group v-model="formParams.status">
          <a-radio
            v-for="item in props.sysNormalDisable"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="备注" field="remark" show-colon>
        <a-textarea
          v-model="formParams.remark"
          allow-clear
          placeholder="请输入备注..."
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
  </a-drawer>
</template>

<style scoped lang="scss"></style>
