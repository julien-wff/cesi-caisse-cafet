import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import Login from '@/views/Login.vue';
import Session from '@/views/Session.vue';
import TestSession from '@/views/TestSession.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/session',
        name: 'session',
        component: Session,
    },
    {
        path: '/test-session',
        name: 'test-session',
        component: TestSession,
    },
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
