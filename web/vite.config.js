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
    plugins: [
        vue(),
        {
            name: 'ressources-names-extractor',
            apply: 'build',
            writeBundle: function (options, bundle) {
                fs.writeFileSync(
                    path.resolve(options.dir, 'build.json'),
                    JSON.stringify(Object.keys(bundle), null, 2)
                );
            },
        }
    ],
});
