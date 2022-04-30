/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// UpUp types definitions
// https://github.com/TalAter/UpUp/tree/master/docs
declare const UpUp: {
    start: (settings?: Partial<UpUpSettings>) => void;
    addSettings: (settings?: Partial<UpUpSettings>) => void;
    debug: (newState?: boolean) => void;
};

declare interface UpUpSettings {
    'content-url': string;
    content: string;
    assets: string[];
    'cache-version': string;
    'service-worker-url': string;
    scope: string;
}
