<!-- 由 Dioa 创建于 2024-08-15 星期四 -->
<script lang="ts" setup>
import {
  type FileItem,
  Message,
  Modal,
  type UploadInstance,
} from '@arco-design/web-vue'
import { h } from 'vue'
import { download } from '@/utils/request'

defineOptions({
  name: 'UserImportDialog',
})

const emits = defineEmits(['submit'])

const { getToken } = useAuth()

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
  required: true,
})

// 用户导入参数
const upload = ref({
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: `Bearer ${getToken()}` },
  // 上传的地址
  url: `${import.meta.env.VITE_WEB_BASE_URL}/system/user/importData`,
})

// 上传组件实例
const UploadRef = shallowRef<UploadInstance>()

// 文件列表
const fileList = ref<FileItem[]>([])

// 文件上传中处理
function handleFileUploadProgress() {
  upload.value.isUploading = true
}

// 文件上传成功处理
function handleFileSuccess(fileItem: FileItem) {
  upload.value.isUploading = false
  if (fileItem.response?.code !== 200) {
    Message.error(fileItem.response?.msg)
    nextTick(() => {
      fileList.value = []
    })
    return
  }
  visible.value = false
  fileList.value = []
  Modal.info({
    title: '导入结果',
    content: () =>
      h(
        'div',
        {
          class:
            'overflow-x-hidden overflow-y-auto max-h-70vh pt-10px px-20px pb-0',
        },
        fileItem.response?.msg,
      ),
    hideCancel: true,
    onOk: () => {
      emits('submit')
    },
  })
}

// 下载模板
function handleDownloadTemplate() {
  download(
    '/system/user/importTemplate',
    {},
    `user_template_${new Date().getTime()}.xlsx`,
  )
}

function handleSubmit() {
  UploadRef.value?.submit()
}

function handleClose() {
  fileList.value = []
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="用户导入"
    @close="handleClose"
  >
    <a-upload
      ref="UploadRef"
      v-model:file-list="fileList"
      draggable
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="`${upload.url}?updateSupport=${upload.updateSupport}`"
      :disabled="upload.isUploading"
      :auto-upload="false"
      @progress="handleFileUploadProgress"
      @success="handleFileSuccess"
    >
      <template #upload-button>
        <div
          flex="~ col"
          border="~ dashed border-color-2"
          p="y-40px"
          hover="border-primary-6"
          items-center
          justify-center
          overflow-hidden
          rounded
          bg-fill-color-2
          transition-all
        >
          <div i-solar-cloud-upload-linear text="80px text-color-3" mb-3 />

          <div text-sm>
            将文件拖到此处，或
            <span text="primary-6">点击上传</span>
          </div>
        </div>
      </template>
    </a-upload>

    <div mt-3 flex items-center justify-between>
      <div flex items-center text="sm text-color-2">
        <div>仅允许导入xls、xlsx格式文件，</div>
        <a-link @click="handleDownloadTemplate">
          下载模板
        </a-link>
      </div>

      <a-checkbox>更新已存在的用户</a-checkbox>
    </div>

    <template #footer>
      <a-button @click="visible = false">
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit">
        确认
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped></style>
