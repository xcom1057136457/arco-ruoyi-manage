<!-- 由 Dioa 创建于 2024-06-05 星期三 -->
<script setup lang="ts">
import { getJob } from '@/api/monitor/job'
import { useDict } from '@/utils/dict'
import { selectDictLabel } from '@/utils/utils'

defineOptions({
  name: 'JobDetailDialog',
})

const visible = defineModel('visible', { default: false })

const { sys_job_group } = useDict('sys_job_group')

// 加载详情
const detailInfo = ref<any>({})

const loading = ref(false)

async function loadDetailInfo(jobId: any) {
  loading.value = true
  try {
    const { code, data }: any = await getJob(jobId)
    if (code === 200) {
      detailInfo.value = data
    }
  }
  finally {
    loading.value = false
  }
}

// 任务组名字典翻译
function jobGroupFormat(row: any) {
  return selectDictLabel(sys_job_group.value, row.jobGroup)
}

// 关闭
function handleClose() {
  detailInfo.value = {}
  loading.value = false
}

defineExpose({
  detailInfo,
  loadDetailInfo,
})
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    title="任务详情"
    :width="800"
    unmount-on-close
    :mask-closable="false"
    hide-cancel
    @close="handleClose"
  >
    <a-spin :loading dot w-full>
      <a-descriptions size="large" bordered :column="2">
        <a-descriptions-item label="任务编号:">
          {{ detailInfo.jobId }}
        </a-descriptions-item>

        <a-descriptions-item label="任务分组:">
          {{ jobGroupFormat(detailInfo) }}
        </a-descriptions-item>

        <a-descriptions-item label="任务名称:">
          {{ detailInfo.jobName }}
        </a-descriptions-item>

        <a-descriptions-item label="创建时间:">
          {{ detailInfo.createTime }}
        </a-descriptions-item>

        <a-descriptions-item label="cron表达式:">
          {{ detailInfo.cronExpression }}
        </a-descriptions-item>

        <a-descriptions-item label="下次执行时间:">
          {{ detailInfo.nextValidTime }}
        </a-descriptions-item>

        <a-descriptions-item label="调用目标方法:" :span="2">
          {{ detailInfo.invokeTarget }}
        </a-descriptions-item>

        <a-descriptions-item label="任务状态:">
          {{
            detailInfo.status === "0"
              ? "正常"
              : detailInfo.status === "1"
                ? "失败"
                : ""
          }}
        </a-descriptions-item>

        <a-descriptions-item label="是否并发:">
          {{
            detailInfo.concurrent === "0"
              ? "允许"
              : detailInfo.concurrent === "1"
                ? "禁止"
                : ""
          }}
        </a-descriptions-item>

        <a-descriptions-item label="执行策略:">
          <div v-if="detailInfo.misfirePolicy === '0'">
            默认策略
          </div>
          <div v-else-if="detailInfo.misfirePolicy === '1'">
            立即执行
          </div>
          <div v-else-if="detailInfo.misfirePolicy === '2'">
            执行一次
          </div>
          <div v-else-if="detailInfo.misfirePolicy === '3'">
            放弃执行
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
