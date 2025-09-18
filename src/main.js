import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router'
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import SEOPlugin from './plugins/seo'
import { loadGoogleMaps } from './utils/googleMapsLoader'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
});
app.use(SEOPlugin);

// Load Google Maps API on app initialization
loadGoogleMaps().catch(error => {
  console.warn('Google Maps API failed to load:', error.message);
});

app.mount('#app');