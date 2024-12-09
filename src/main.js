import './assets/main.css'
import 'flowbite/dist/flowbite.css';
import 'flowbite';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
