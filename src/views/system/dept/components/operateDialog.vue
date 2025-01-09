<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
import type {
  FieldRule,
  FormInstance,
} from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import type { IFormParams } from '../types'

defineOptions({
  name: 'OperateDialog',
})

const props = withDefaults(
  defineProps<{
    rowId?: any
    sysNormalDisable?: any[]
    deptTreeData?: any[]
  }>(),
  {
    rowId: '',
    sysNormalDisable: () => {
      return []
    },
    deptTreeData: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const OperateFormRef = shallowRef<FormInstance>()

const visible = defineModel('visible', { default: false })

// tree搜索
function filterTreeNode(searchValue: any, nodeData: any) {
  return nodeData.deptName.toLowerCase().includes(searchValue.toLowerCase())
}

const formParams = ref<IFormParams>({
  status: '0',
  orderNum: 0,
})

const formRules = ref<Record<string, FieldRule>>({
  parentId: { required: true, message: '请选择上级菜单!' },
  deptName: { required: true, message: '请输入部门名称!' },
  orderNum: { required: true, type: 'number', message: '请输入显示排序!' },
  email: { required: true, message: '请输入邮箱!' },
  phone: { required: true, message: '请输入联系电话!' },
})

// 提交表单
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

// 关闭弹窗回调
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
    title="新增部门"
    :width="500"
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
      <a-form-item label="上级部门" field="parentId" show-colon>
        <a-tree-select
          v-model="formParams.parentId"
          :data="props.deptTreeData"
          placeholder="请选择上级菜单..."
          allow-search
          allow-clear
          :field-names="{
            title: 'deptName',
            key: 'deptId',
            children: 'children',
            icon: 'checkable',
          }"
          :tree-props="{ defaultExpandAll: true, blockNode: true }"
          :filter-tree-node="filterTreeNode"
        />
      </a-form-item>

      <a-form-item label="部门名称" field="deptName" show-colon>
        <a-input
          v-model.trim="formParams.deptName"
          placeholder="请输入部门名称..."
          allow-clear
        />
      </a-form-item>

      <a-form-item label="显示排序" field="orderNum" show-colon>
        <a-input-number
          v-model="formParams.orderNum"
          placeholder="请输入显示排序..."
          allow-clear
          hide-button
        />
      </a-form-item>

      <a-form-item label="负责人" field="leader" show-colon>
        <a-input
          v-model.trim="formParams.leader"
          placeholder="请输入负责人..."
          allow-clear
        />
      </a-form-item>

      <a-form-item label="联系电话" field="phone" show-colon>
        <a-input
          v-model.trim="formParams.phone"
          placeholder="请输入联系电话..."
          allow-clear
        />
      </a-form-item>

      <a-form-item label="邮箱" field="email" show-colon>
        <a-input
          v-model.trim="formParams.email"
          placeholder="请输入邮箱..."
          allow-clear
        />
      </a-form-item>

      <a-form-item label="部门状态" field="status" show-colon>
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
    </a-form>
    <template #footer>
      <a-button @click="visible = !visible">
        取消
      </a-button>
      <a-button type="primary" :loading @click="handleSubmit">
        确认
      </a-button>
    </template>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
