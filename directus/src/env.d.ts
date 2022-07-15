declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare namespace Express {
    import { Accountability } from '@directus/shared/src/types/accountability';

    export interface Request {
        accountability: Accountability;
    }
}
