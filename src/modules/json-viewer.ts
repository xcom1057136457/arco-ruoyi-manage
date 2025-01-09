import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import type { App } from 'vue'

export function install(app: App) {
  app.use(JsonViewer)
}
