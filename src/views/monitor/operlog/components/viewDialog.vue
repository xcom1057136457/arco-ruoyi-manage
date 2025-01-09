<!-- 由 Dioa 创建于 2024-06-04 星期二 -->
<script setup lang="ts">
import { selectDictLabel } from '@/utils/utils'

defineOptions({
  name: 'ViewDialog',
})

const props = withDefaults(
  defineProps<{
    viewDetail: Record<string, unknown>
    sysOperType?: any[]
  }>(),
  {
    viewDetail: () => {
      return {}
    },
    sysOperType: () => {
      return []
    },
  },
)

const visible = defineModel('visible', { default: false })

// 操作日志类型字典翻译
function typeFormat(row: any) {
  return selectDictLabel(props.sysOperType, row.businessType)
}
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    title="操作日志详情"
    unmount-on-close
    :mask-closable="false"
    :width="850"
    hide-cancel
    ok-text="确认"
  >
    <a-descriptions :column="2" bordered size="large">
      <a-descriptions-item label="操作模块:">
        {{ props.viewDetail!.title }} / {{ typeFormat(props.viewDetail) }}
      </a-descriptions-item>

      <a-descriptions-item label="请求地址:">
        {{ props.viewDetail.operUrl }}
      </a-descriptions-item>

      <a-descriptions-item label="登录信息:">
        {{ props.viewDetail.operName }} / {{ props.viewDetail.operIp }} / {{ props.viewDetail.operLocation }}
      </a-descriptions-item>

      <a-descriptions-item label="请求方式:">
        {{ props.viewDetail.requestMethod }}
      </a-descriptions-item>

      <a-descriptions-item label="操作方法:" :span="2">
        {{ props.viewDetail.method }}
      </a-descriptions-item>

      <a-descriptions-item label="请求参数:" :span="2">
        {{ props.viewDetail.operParam }}
      </a-descriptions-item>

      <a-descriptions-item label="返回参数:" :span="2">
        {{ props.viewDetail.jsonResult }}
      </a-descriptions-item>

      <a-descriptions-item label="操作状态:">
        <div v-if="props.viewDetail.status === 0">
          正常
        </div>
        <div v-else-if="props.viewDetail.status === 1">
          失败
        </div>
      </a-descriptions-item>

      <a-descriptions-item label="消耗时间:">
        {{ props.viewDetail.costTime }}毫秒
      </a-descriptions-item>

      <a-descriptions-item label="操作时间:">
        {{ props.viewDetail.operTime }}
      </a-descriptions-item>

      <a-descriptions-item v-if="props.viewDetail.status === 1" label="异常信息:" :span="2">
        {{ props.viewDetail.errorMsg }}毫秒
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<style scoped lang="scss"></style>
