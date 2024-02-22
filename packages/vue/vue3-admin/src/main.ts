import './assets/main.css'

import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'

import App from './App.vue'
import router from './router'
import GlobalComponents from './components'

const app = createApp(App)


app.use(ElementPlus)
app.use(GlobalComponents)
app.use(createPinia())
app.use(router)

app.mount('#app')
