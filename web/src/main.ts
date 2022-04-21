import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './app.css';

// Dayjs locale
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');
