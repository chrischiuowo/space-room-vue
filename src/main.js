import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import AOS from 'aos'
import VueLazyLoad from 'vue3-lazyload'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/scss/main.scss'
import 'aos/dist/aos.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

AOS.init({
  offset: 100,
  duration: 1000,
  once: true
})

app.use(VueAxios, axios)
app.use(router)
app.use(pinia)
app.use(VueLazyLoad, {})

app.mount('#app')
