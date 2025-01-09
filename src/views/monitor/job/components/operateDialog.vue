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
    sysJobGroup?: any[]
    sysJobStatus?: any[]
  }>(),
  {
    rowId: '',
    sysJobGroup: () => {
      return []
    },
    sysJobStatus: () => {
      return []
    },
  },
)

const emits = defineEmits(['submit'])

const visible = defineModel('visible', { default: false })

const formParams = ref<IFormParams>({
  misfirePolicy: '1',
  concurrent: '1',
  status: '0',
})

const formRules = ref<Record<string, FieldRule>>({
  jobName: { required: true, message: '请输入任务名称!' },
  invokeTarget: { required: true, message: '请输入调用方法!' },
  cronExpression: { required: true, message: '请输入cron表达式!' },
})

const OperateFormRef = shallowRef<FormInstance>()

const submitLoading = ref(false)

function handleSubmit() {
  OperateFormRef.value?.validate((errors: any) => {
    if (!errors) {
      submitLoading.value = true
      emits('submit', cloneDeep(formParams.value), () => {
        submitLoading.value = false
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
    :title="props.rowId ? '修改定时任务' : '新增定时任务'"
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
      <a-form-item label="任务名称" field="jobName" show-colon>
        <a-input
          v-model="formParams.jobName"
          allow-clear
          placeholder="请输入任务名称..."
        />
      </a-form-item>

      <a-form-item label="任务分组" field="jobGroup" show-colon>
        <a-select
          v-model="formParams.jobGroup"
          allow-clear
          allow-search
          placeholder="请选择任务分组..."
        >
          <a-option
            v-for="item in props.sysJobGroup"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item label="调用方法" field="invokeTarget" show-colon>
        <a-input
          v-model="formParams.invokeTarget"
          allow-clear
          placeholder="请输入调用方法..."
        />
        <template #help>
          <div m="t-2 b-5" space-y-1>
            <div>Bean调用示例：ryTask.ryParams('ry')</div>
            <div>
              Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
            </div>
            <div>参数说明：支持字符串，布尔类型，长整型，浮点型，整型</div>
          </div>
        </template>
      </a-form-item>

      <a-form-item label="cron表达式" field="cronExpression" show-colon>
        <a-input
          v-model="formParams.cronExpression"
          allow-clear
          placeholder="请输入cron表达式..."
        >
          <template #append>
            <a
              class="text-sm text-black/60"
              href="https://www.matools.com/cron/?embed"
              target="_blank"
              flex
              cursor-pointer
              items-center
              gap-x-1
              no-underline
            >
              <icon-clock-circle text-base />
              <span>生成表达式</span>
            </a>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="执行策略" field="misfirePolicy" show-colon>
        <a-radio-group v-model="formParams.misfirePolicy" type="button">
          <a-radio value="1">
            立即执行
          </a-radio>
          <a-radio value="2">
            执行一次
          </a-radio>
          <a-radio value="3">
            放弃执行
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="是否并发" field="concurrent" show-colon>
        <a-radio-group v-model="formParams.concurrent" type="button">
          <a-radio value="0">
            允许
          </a-radio>
          <a-radio value="1">
            禁止
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="状态" field="status" show-colon>
        <a-select
          v-model="formParams.status"
          allow-clear
          allow-search
          placeholder="请选择状态..."
        >
          <a-option
            v-for="item in props.sysJobStatus"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button @click="visible = false">
        取消
      </a-button>
      <a-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确认
      </a-button>
    </template>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
