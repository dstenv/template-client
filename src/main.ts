import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import VConsole from 'vconsole'
import router from './router'
import 'virtual:svg-icons-register'

import '@/apis/axiosController'
import vantUI from './utils/vantUI'
import projectUI from './utils/projectUI'

// import 'uno.css'
import 'vant/lib/index.css'
import './style/common.scss'
import './style/tailwind.scss'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersist))
app.use(router)
app.use(vantUI)
app.use(projectUI)
app.use(new VConsole({}) as any)

app.mount('#app')
