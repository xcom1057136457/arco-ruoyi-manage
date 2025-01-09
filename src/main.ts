import { createApp } from 'vue'
import print from 'vue3-print-nb'
import App from './App.vue'
import 'virtual:uno.css'
import 'animate.css'
import 'normalize.css/normalize.css'
import 'virtual:svg-icons-register'
import './permission'
import '@/assets/styles/index.scss'
import hasPermi from '@/directives/hasPermi'
import hasRole from '@/directives/hasRole'

const app = createApp(App)

const modules = import.meta.glob('./modules/*.ts', { eager: true })

Object.values(modules).forEach((module: any) => {
  app.use(module)
})

app.directive('hasPermi', hasPermi)

app.directive('hasRole', hasRole)

app.directive('print', print)

app.mount('#app')
