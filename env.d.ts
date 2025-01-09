/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-json-viewer'

declare module 'jsencrypt/bin/jsencrypt.min'

declare module 'vue3-print-nb'
