import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './app.css';

createApp(App)
    .use(router)
    .mount('#app');
