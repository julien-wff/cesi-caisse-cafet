import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    build: {
        sourcemap: true,
    },
    plugins: [
        vue(),
        {
            name: 'ressources-names-extractor',
            apply: 'build',
            writeBundle: function (options, bundle) {
                fs.writeFileSync(
                    path.resolve(options.dir, 'build.json'),
                    JSON.stringify([
                        ...Object.keys(bundle),
                        ...fs.readdirSync(path.resolve('public')),
                    ], null, 2)
                );
            },
        }
    ],
});
