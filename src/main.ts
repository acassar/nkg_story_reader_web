import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeflex/primeflex.css'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { BiSendFill, BiGearFill, LaUndoSolid } from 'oh-vue-icons/icons'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'

addIcons(BiSendFill, BiGearFill, LaUndoSolid)

const app = createApp(App)

app.directive('tooltip', Tooltip)

app.component('v-icon', OhVueIcon)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darModeSelector: true,
    },
  },
})

app.mount('#app')
