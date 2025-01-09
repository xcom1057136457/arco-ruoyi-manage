<!-- 由 Dioa 创建于 2024-06-03 星期一 -->
<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import type { IDictFormParams } from '../types'

defineOptions({
  name: 'DictOperateDialog',
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

// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
])

const formParams = ref<IDictFormParams>({})

const formRules = ref<Record<string, FieldRule>>({
  dictLabel: { required: true, message: '请输入数据标签!' },
  dictValue: { required: true, message: '请输入数据键值!' },
  dictSort: { required: true, type: 'number', message: '请输入显示排序!' },
})

const DictOperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

// 表单提交
function handleSubmit() {
  DictOperateFormRef.value?.validate((errors: any) => {
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
  DictOperateFormRef.value?.resetFields()
}

defineExpose({
  formParams,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="props.rowId ? '修改字段数据' : '新增字典数据'"
    :width="500"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form
      ref="DictOperateFormRef"
      :model="formParams"
      :rules="formRules"
      auto-label-width
    >
      <a-form-item label="字典类型" field="dictType" show-colon>
        <a-input
          v-model="formParams.dictType"
          allow-clear
          placeholder="请输入字典类型..."
        />
      </a-form-item>

      <a-form-item label="数据标签" field="dictLabel" show-colon>
        <a-input
          v-model="formParams.dictLabel"
          allow-clear
          placeholder="请输入数据标签..."
        />
      </a-form-item>

      <a-form-item label="数据键值" field="dictValue" show-colon>
        <a-input
          v-model="formParams.dictValue"
          allow-clear
          placeholder="请输入数据键值..."
        />
      </a-form-item>

      <a-form-item label="样式属性" field="cssClass" show-colon>
        <a-input
          v-model="formParams.cssClass"
          allow-clear
          placeholder="请输入样式属性..."
        />
      </a-form-item>

      <a-form-item label="显示排序" field="dictSort" show-colon>
        <a-input-number
          v-model="formParams.dictSort"
          allow-clear
          placeholder="请输入显示排序..."
          hide-button
        />
      </a-form-item>

      <a-form-item label="回显样式" field="listClass" show-colon>
        <a-select
          v-model="formParams.listClass"
          allow-clear
          placeholder="请选择回显样式..."
          allow-search
        >
          <a-option
            v-for="item in listClassOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="状态" field="status" show-colon>
        <a-select
          v-model="formParams.status"
          allow-clear
          placeholder="请选择状态..."
          allow-search
        >
          <a-option
            v-for="item in props.sysNormalDisable"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
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
