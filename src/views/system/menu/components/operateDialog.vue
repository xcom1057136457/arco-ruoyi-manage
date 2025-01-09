<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import type { IFormParams } from '../types'

defineOptions({
  name: 'OperateDialog',
})

const props = withDefaults(
  defineProps<{
    menuTreeData?: any
    sysShowHide?: any
    sysNormalDisable?: any
    rowId?: any
  }>(),
  {
    menuTreeData: [],
    sysShowHide: [],
    sysNormalDisable: [],
    rowId: '',
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

// tree搜索
function filterTreeNode(searchValue: any, nodeData: any) {
  return nodeData.menuName.toLowerCase().includes(searchValue.toLowerCase())
}

const formParams = ref<IFormParams>({
  parentId: 0,
  menuType: 'M',
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
})

const formRules = ref<Record<string, FieldRule>>({
  menuName: { required: true, message: '请输入菜单名称!' },
  orderNum: { required: true, type: 'number', message: '请输入显示排序!' },
  path: { required: true, message: '请输入路由地址!' },
})

const loading = ref(false)

const OperateFormRef = shallowRef<FormInstance>()

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

function handleClose() {
  formParams.value = {
    parentId: 0,
    menuType: 'M',
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0',
  }
  OperateFormRef.value?.resetFields()
}

defineExpose({
  formParams,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="props.rowId ? '修改菜单' : '新增菜单'"
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
      <a-form-item field="parentId" label="上级菜单" show-colon>
        <a-tree-select
          v-model="formParams.parentId"
          :data="props.menuTreeData"
          placeholder="请选择上级菜单..."
          allow-search
          allow-clear
          :field-names="{
            title: 'menuName',
            key: 'menuId',
            children: 'children',
            icon: 'checkable',
          }"
          :tree-props="{ defaultExpandAll: true, blockNode: true }"
          :filter-tree-node="filterTreeNode"
        />
      </a-form-item>

      <a-form-item field="menuType" label="菜单类型" show-colon>
        <a-radio-group v-model="formParams.menuType">
          <a-radio value="M">
            目录
          </a-radio>
          <a-radio value="C">
            菜单
          </a-radio>
          <a-radio value="F">
            按钮
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'F'"
        field="icon"
        label="菜单图标"
        show-colon
      >
        <a-popover trigger="click" :content-style="{ padding: 0 }">
          <a-input
            v-model="formParams.icon"
            placeholder="请选择菜单图标..."
            readonly
          >
            <template #prefix>
              <svg-icon :icon-class="formParams.icon" />
            </template>
          </a-input>
          <template #content>
            <div w-388px>
              <icon-select v-model="formParams.icon" />
            </div>
          </template>
        </a-popover>
      </a-form-item>

      <a-form-item field="menuName" label="菜单名称" show-colon>
        <a-input
          v-model.trim="formParams.menuName"
          placeholder="请输入菜单名称..."
          allow-clear
        />
      </a-form-item>

      <a-form-item field="orderNum" label="显示排序" show-colon>
        <a-input-number
          v-model="formParams.orderNum"
          placeholder="请输入显示排序..."
          allow-clear
          hide-button
        />
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'F'"
        field="isFrame"
        label="是否外链"
        show-colon
        tooltip="选择是外链则路由地址需要以`http(s)://`开头"
      >
        <a-radio-group v-model="formParams.isFrame">
          <a-radio value="0">
            是
          </a-radio>
          <a-radio value="1">
            否
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'F'"
        field="path"
        label="路由地址"
        show-colon
        tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
      >
        <a-input
          v-model.trim="formParams.path"
          allow-clear
          placeholder="请输入路由地址..."
        />
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType === 'C'"
        field="component"
        label="组件路径"
        show-colon
        tooltip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
      >
        <a-input
          v-model.trim="formParams.component"
          allow-clear
          placeholder="请输入组件路径..."
        />
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'M'"
        field="perms"
        label="权限字符"
        show-colon
        tooltip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
      >
        <a-input
          v-model.trim="formParams.perms"
          allow-clear
          placeholder="请输入权限字符..."
        />
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType === 'C'"
        field="query"
        label="路由参数"
        show-colon
        tooltip="访问路由的默认传递参数，如：`{id: 1, name: ry}`"
      >
        <a-input
          v-model.trim="formParams.query"
          allow-clear
          placeholder="请输入路由参数..."
        />
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType === 'C'"
        field="isCache"
        label="是否缓存"
        show-colon
        tooltip="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
      >
        <a-radio-group v-model="formParams.isCache">
          <a-radio value="0">
            缓存
          </a-radio>
          <a-radio value="1">
            不缓存
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'F'"
        field="visible"
        label="显示状态"
        show-colon
        tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
      >
        <a-radio-group v-model="formParams.visible">
          <a-radio
            v-for="item in props.sysShowHide"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="formParams.menuType !== 'F'"
        field="status"
        label="菜单状态"
        show-colon
        tooltip="选择停用则路由将不会出现在侧边栏，也不能被访问"
      >
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
