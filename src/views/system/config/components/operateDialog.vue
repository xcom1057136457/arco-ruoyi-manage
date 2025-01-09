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
    sysYesNo?: any[]
  }>(),
  {
    rowId: '',
    sysYesNo: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

const formParams = ref<IFormParams>({
  configType: 'Y',
})

const formRules = ref<Record<string, FieldRule>>({
  configName: { required: true, message: '请输入参数名称!' },
  configKey: { required: true, message: '请输入参数键名!' },
  configValue: { required: true, message: '请输入参数键值!' },
})

const OperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

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
    :title="props.rowId ? '修改参数' : '新增参数'"
    :width="500"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form ref="OperateFormRef" :model="formParams" :rules="formRules" auto-label-width>
      <a-form-item label="参数名称" field="configName" show-colon>
        <a-input
          v-model="formParams.configName"
          allow-clear
          placeholder="请输入参数名称..."
        />
      </a-form-item>

      <a-form-item label="参数键名" field="configKey" show-colon>
        <a-input
          v-model="formParams.configKey"
          allow-clear
          placeholder="请输入参数键名..."
        />
      </a-form-item>

      <a-form-item label="参数键值" field="configValue" show-colon>
        <a-input
          v-model="formParams.configValue"
          allow-clear
          placeholder="请输入参数键值..."
        />
      </a-form-item>

      <a-form-item label="系统内置" field="configType" show-colon>
        <a-radio-group v-model="formParams.configType">
          <a-radio
            v-for="item in props.sysYesNo"
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
