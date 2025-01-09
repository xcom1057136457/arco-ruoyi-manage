<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import { selectDictLabel } from '@/utils/utils'
import { useDict } from '@/utils/dict'

defineOptions({
  name: 'LogJobDetailDialog',
})
const { sys_job_group } = useDict('sys_job_group')

const visible = defineModel('visible', { default: false })

const detailInfo = ref<any>({})

// 任务组名字典翻译
function jobGroupFormat(row: any) {
  return selectDictLabel(sys_job_group.value, row.jobGroup)
}

function handleClose() {
  detailInfo.value = {}
}

defineExpose({
  detailInfo,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    title="调度日志详情"
    :width="800"
    unmount-on-close
    :mask-closable="false"
    hide-cancel
    @close="handleClose"
  >
    <a-descriptions :column="2" bordered size="large">
      <a-descriptions-item label="日志序号:">
        {{ detailInfo.jobLogId }}
      </a-descriptions-item>

      <a-descriptions-item label="任务分组:">
        {{ jobGroupFormat(detailInfo) }}
      </a-descriptions-item>

      <a-descriptions-item label="任务名称:">
        {{ detailInfo.jobName }}
      </a-descriptions-item>

      <a-descriptions-item label="执行时间:">
        {{ detailInfo.createTime }}
      </a-descriptions-item>

      <a-descriptions-item label="调用方法:" :span="2">
        {{ detailInfo.invokeTarget }}
      </a-descriptions-item>

      <a-descriptions-item label="日志信息:" :span="2">
        {{ detailInfo.jobMessage }}
      </a-descriptions-item>

      <a-descriptions-item label="执行状态:" :span="2">
        <div v-if="detailInfo.status === '0'">
          正常
        </div>
        <div v-else-if="detailInfo.status === '1'">
          失败
        </div>
      </a-descriptions-item>

      <a-descriptions-item v-if="detailInfo.status === '1'" label="异常信息:" :span="2">
        {{ detailInfo.exceptionInfo }}
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
