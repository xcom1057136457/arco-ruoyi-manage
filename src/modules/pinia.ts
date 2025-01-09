import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function install(app: App) {
  app.use(createPinia().use(piniaPluginPersistedstate))
}
