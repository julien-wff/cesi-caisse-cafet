import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import 'upup';
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

// Service worker for offline capabilities
if (import.meta.env.PROD && navigator.onLine) {
    fetch('/build.json')
        .then(res => res.json())
        .then((ressources: string[]) => {
            UpUp.start({
                'content-url': 'index.html',
                'assets': ressources,
                'service-worker-url': 'upup.sw.min.js',
            });
        })
        .catch(e => console.error('Failed to install service worker', e));
}
