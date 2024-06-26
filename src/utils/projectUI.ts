import SvgIcon from '@/components/XSvgIcon/index.vue'
import type { App } from 'vue'

const projectUI = [SvgIcon]

export default {
  install(app: App) {
    projectUI.forEach((component) => {
      app.component(component.name, component)
    })
  },
}
