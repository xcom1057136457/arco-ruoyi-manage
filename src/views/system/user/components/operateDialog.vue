<!-- 由 Dioa 创建于 2024-06-06 星期四 -->
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
    deptOptions?: any[]
    sysUserSex?: any[]
    sysNormalDisable?: any[]
    postOptions?: any[]
    roleOptions?: any[]
  }>(),
  {
    rowId: '',
    deptOptions: () => {
      return []
    },
    sysUserSex: () => {
      return []
    },
    sysNormalDisable: () => {
      return []
    },
    postOptions: () => {
      return []
    },
    roleOptions: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

function filterTreeNode(searchValue: any, nodeData: any) {
  return nodeData.label.toLowerCase().includes(searchValue.toLowerCase())
}

const formParams = ref<IFormParams>({})

const formRules = ref<Record<string, FieldRule[]>>({
  userName: [
    { required: true, message: '请输入用户名称!' },
    {
      minLength: 2,
      maxLength: 20,
      message: '用户名称长度必须介于 2 和 20 之间',
    },
  ],
  nickName: [{ required: true, message: '请输入用户昵称!' }],
  password: [
    { required: true, message: '请输入用户密码!' },
    {
      minLength: 5,
      maxLength: 20,
      message: '用户密码长度必须介于 5 和 20 之间',
    },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址!' }],
  phonenumber: [
    {
      validator(value, callback) {
        if (!value) {
          callback()
        }
        else {
          if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
            callback()
          }
          else {
            callback('请输入正确的手机号码!')
          }
        }
      },
    },
  ],
})

const OperateFormRef = shallowRef<FormInstance>()

const loading = ref(false)

function handleSubmit() {
  OperateFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      emits('submit', cloneDeep(formParams.value), () => {
        loading.value = false
      })
    }
  })
}

function handleClose() {
  formParams.value.password = ''
  OperateFormRef.value?.resetFields()
}

defineExpose({
  formParams,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="props.rowId ? '修改用户' : '新增用户'"
    :width="800"
    unmount-on-close
    :mask-closable="false"
    @close="handleClose"
  >
    <a-form
      ref="OperateFormRef"
      grid="~ cols-2"
      :model="formParams"
      :rules="formRules"
      auto-label-width
      gap-x-5
    >
      <a-form-item label="用户昵称" field="nickName" show-colon>
        <a-input
          v-model="formParams.nickName"
          allow-clear
          placeholder="请输入用户昵称..."
        />
      </a-form-item>

      <a-form-item label="归属部门" field="deptId" show-colon>
        <a-tree-select
          v-model="formParams.deptId"
          allow-clear
          allow-search
          :data="props.deptOptions"
          placeholder="请选择归属部门..."
          :field-names="{
            title: 'label',
            key: 'id',
            children: 'children',
          }"
          :filter-tree-node="filterTreeNode"
          :tree-props="{ defaultExpandAll: true, blockNode: true }"
        />
      </a-form-item>

      <a-form-item label="手机号码" field="phonenumber" show-colon>
        <a-input
          v-model="formParams.phonenumber"
          allow-clear
          placeholder="请输入手机号码..."
        />
      </a-form-item>

      <a-form-item label="邮箱" field="email" show-colon>
        <a-input
          v-model="formParams.email"
          allow-clear
          placeholder="请输入邮箱..."
        />
      </a-form-item>

      <a-form-item label="用户名称" field="userName" show-colon>
        <a-input
          v-model="formParams.userName"
          allow-clear
          placeholder="请输入用户名称..."
          :max-length="30"
        />
      </a-form-item>

      <a-form-item
        v-if="!props.rowId"
        label="用户密码"
        field="password"
        show-colon
      >
        <a-input
          v-model="formParams.password"
          allow-clear
          placeholder="请输入用户密码..."
        />
      </a-form-item>

      <a-form-item label="用户性别" field="sex" show-colon>
        <a-select
          v-model="formParams.sex"
          allow-clear
          allow-search
          placeholder="请选择用户性别..."
        >
          <a-option
            v-for="item in props.sysUserSex"
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
          allow-search
          placeholder="请选择状态..."
        >
          <a-option
            v-for="item in props.sysNormalDisable"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="岗位" field="postIds" show-colon>
        <a-select
          v-model="formParams.postIds"
          allow-clear
          allow-search
          multiple
          :max-tag-count="2"
          placeholder="请选择岗位..."
        >
          <a-option
            v-for="item in props.postOptions"
            :key="item.postId"
            :value="item.postId"
            :label="item.postName"
            :disabled="item.status === '1'"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="角色" field="roleIds" show-colon>
        <a-select
          v-model="formParams.roleIds"
          allow-clear
          allow-search
          multiple
          :max-tag-count="2"
          placeholder="请选择角色..."
        >
          <a-option
            v-for="item in props.roleOptions"
            :key="item.roleId"
            :value="item.roleId"
            :label="item.roleName"
            :disabled="item.status === '1'"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="备注" field="remark" show-colon col-span-2>
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
