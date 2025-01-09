<!-- 由 Dioa 创建于 2024-05-28 星期二 -->
<script setup lang="ts">
import type {
  FieldRule,
  FormInstance,
  TreeInstance,
} from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'

defineOptions({
  name: 'OperateDialog',
})

const props = withDefaults(
  defineProps<{
    sysNormalDisable?: any
    menuOptions?: any
    rowId?: any
  }>(),
  {
    sysNormalDisable: [],
    menuOptions: [],
    rowId: '',
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel<boolean>('visible', { default: false })

const formParams = ref({
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 0,
  remark: '',
  menuIds: [],
  menuCheckStrictly: false,
})

const formRules = ref<Record<string, FieldRule>>({
  roleName: { required: true, message: '请输入角色名称!' },
  roleKey: { required: true, message: '请输入权限字符!' },
  roleSort: { required: true, message: '请输入角色名称!', type: 'number' },
})

const MenuTreeRef = shallowRef<TreeInstance>()

// 展开/折叠
const menuExpand = ref(false)

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

const OperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

// 成功回调
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

// 取消回调
function handleCancel() {
  menuExpand.value = false
  menuNodeAll.value = false
  formParams.value.menuCheckStrictly = false
  OperateFormRef.value?.resetFields()
}

defineExpose({
  formParams,
  MenuTreeRef,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="props.rowId ? '修改角色' : '添加角色'"
    :width="500"
    :mask-closable="false"
    unmount-on-close
    @close="handleCancel"
  >
    <a-form
      ref="OperateFormRef"
      :model="formParams"
      auto-label-width
      :rules="formRules"
    >
      <a-form-item label="角色名称" field="roleName" show-colon>
        <a-input
          v-model="formParams.roleName"
          placeholder="请输入角色名称..."
          allow-clear
        />
      </a-form-item>

      <a-form-item
        label="权限字符"
        field="roleKey"
        tooltip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
        show-colon
      >
        <a-input
          v-model="formParams.roleKey"
          placeholder="请输入权限字符..."
          allow-clear
        />
      </a-form-item>

      <a-form-item label="角色顺序" field="roleSort" show-colon>
        <a-input-number
          v-model="formParams.roleSort"
          placeholder="请输入角色名称..."
          allow-clear
          hide-button
        />
      </a-form-item>

      <a-form-item label="状态" field="status" show-colon>
        <a-radio-group v-model="formParams.status">
          <a-radio
            v-for="item in props.sysNormalDisable"
            :key="item.value"
            :value="Number(item.value)"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="菜单权限" field="menuIds" show-colon>
        <div flex="~ col" mt-5px w-full>
          <div mb-3 space-x-xs>
            <a-checkbox v-model="menuExpand">
              展开/折叠
            </a-checkbox>

            <a-checkbox v-model="menuNodeAll">
              全选/全不选
            </a-checkbox>

            <a-checkbox v-model="formParams.menuCheckStrictly">
              父子联动
            </a-checkbox>
          </div>

          <div border="~ solid border-color-2" box-border rounded-lg p-2>
            <a-tree
              ref="MenuTreeRef"
              v-model:checked-keys="formParams.menuIds"
              block-node
              :checkable="true"
              :check-strictly="!formParams.menuCheckStrictly"
              :data="props.menuOptions"
              :default-expand-all="false"
              :field-names="{
                key: 'id',
                title: 'label',
                children: 'children',
              }"
              :virtual-list-props="{ height: 350 }"
              show-line
            />
          </div>
        </div>
      </a-form-item>

      <a-form-item label="备注" field="remark" show-colon>
        <a-textarea
          v-model="formParams.remark"
          placeholder="请输入备注..."
          allow-clear
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button @click="visible = false">
        取消
      </a-button>
      <a-button type="primary" :loading @click="handleSubmit">
        确定
      </a-button>
    </template>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
