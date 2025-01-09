<!-- 由 Dioa 创建于 2024-06-07 星期五 -->
<script setup lang="ts">
import type { FormInstance, TreeInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import type { IDataPermiFormParams } from '../types'

defineOptions({
  name: 'DataPermiDialog',
})

const props = withDefaults(defineProps<{
  deptTreeData?: any[]
}>(), {
  deptTreeData: () => {
    return []
  },
})

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false, type: Boolean })

const formParams = ref<IDataPermiFormParams>({
  deptCheckStrictly: false,
})

// 数据范围选项
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
])

// 树实例
const MenuTreeRef = shallowRef<TreeInstance>()

// 展开/折叠
const menuExpand = ref(true)

watch(menuExpand, () => {
  if (menuExpand.value) {
    MenuTreeRef.value?.expandAll(true)
  }
  else {
    MenuTreeRef.value?.expandAll(false)
  }
})

// 全选/全不选
const menuNodeAll = ref(false)

watch(menuNodeAll, () => {
  if (menuNodeAll.value) {
    MenuTreeRef.value?.checkAll(true)
  }
  else {
    MenuTreeRef.value?.checkAll(false)
  }
})

const DataPermiFormRef = shallowRef<FormInstance>()

const loading = ref(false)

// 提交
function handleSubmit() {
  DataPermiFormRef.value?.validate((errors) => {
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
  menuExpand.value = true
  menuNodeAll.value = false
  loading.value = false
  DataPermiFormRef.value?.resetFields()
}

defineExpose({
  formParams,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    title="分配数据权限"
    :width="500"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form ref="DataPermiFormRef" :model="formParams" auto-label-width>
      <a-form-item label="角色名称" field="roleName" show-colon>
        <a-input
          v-model="formParams.roleName"
          allow-clear
          placeholder="请输入角色名称..."
          disabled
        />
      </a-form-item>

      <a-form-item label="权限字符" field="roleKey" show-colon>
        <a-input
          v-model="formParams.roleKey"
          allow-clear
          placeholder="请输入权限字符..."
          disabled
        />
      </a-form-item>

      <a-form-item label="权限范围" field="dataScope" show-colon>
        <a-select
          v-model="formParams.dataScope"
          allow-clear
          allow-search
          placeholder="请选择权限范围..."
        >
          <a-option
            v-for="item in dataScopeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item v-if="formParams.dataScope === '2'" label="数据权限" show-colon>
        <div mt-5px w-full>
          <div m="b-3" space-x-xs>
            <a-checkbox v-model="menuExpand">
              展开/折叠
            </a-checkbox>

            <a-checkbox v-model="menuNodeAll">
              全选/全不选
            </a-checkbox>

            <a-checkbox v-model="formParams.deptCheckStrictly">
              父子联动
            </a-checkbox>
          </div>

          <div border="~ solid border-color-2" box-border rounded-lg p-2>
            <a-tree
              ref="MenuTreeRef"
              v-model:checked-keys="formParams.deptIds"
              block-node
              :checkable="true"
              :check-strictly="!formParams.deptCheckStrictly"
              :data="props.deptTreeData"
              :default-expand-all="true"
              :field-names="{
                key: 'id',
                title: 'label',
                children: 'children',
              }"
              :virtual-list-props="{ height: 450 }"
            />
          </div>
        </div>
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
