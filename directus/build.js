const esbuild = require('esbuild');
const pluginVue = require('esbuild-plugin-vue-next');
const cssModulesPlugin = require('esbuild-css-modules-plugin');
const { style } = require('@hyrious/esbuild-plugin-style');
const glob = require('glob');

const APP_EXTENSION_TYPES = ['interface', 'display', 'layout', 'module', 'panel'];
const API_EXTENSION_TYPES = ['hook', 'endpoint'];
const APP_EXTENSION_TYPES_PLURAL = APP_EXTENSION_TYPES.map(t => t + 's');
const API_EXTENSION_TYPES_PLURAL = API_EXTENSION_TYPES.map(t => t + 's');
const APP_SHARED_DEPS = ['@directus/extensions-sdk', 'vue', 'vue-router', 'vue-i18n', 'pinia'];
const API_SHARED_DEPS = ['directus', 'node-fetch'];


const getExtensionNameFromPath = path => path.split('/').at(-3) + '/' + path.split('/').at(-2);

function getExtensions(extensionsTypes) {
    return glob
        .sync(`./src/@(${extensionsTypes.join('|')})/*/index.ts`)
        .reduce((list, path) => ({ ...list, [getExtensionNameFromPath(path)]: path }), {});
}

const SOURCES = ['app', 'api'];
const sourceArgIndex = process.argv.findIndex(arg => arg === '--source' || arg === '-s');
const sources = sourceArgIndex > 0 ?
    process.argv[sourceArgIndex + 1].split(',').filter(s => SOURCES.includes(s)) :
    SOURCES;

const watch = process.argv.includes('--watch') || process.argv.includes('-w');

console.log(`Building ${sources.join(', ')}${watch ? ' in watch mode' : ''}.`);

if (sources.includes('api'))
    esbuild.build({
        entryPoints: getExtensions(API_EXTENSION_TYPES_PLURAL),
        outdir: 'ext',
        bundle: true,
        platform: 'node',
        target: 'node16',
        external: ['./node_modules/*'],
        logLevel: 'info',
        watch,
    })
        .catch(console.error);

if (sources.includes('app'))
    esbuild.build({
        entryPoints: getExtensions(APP_EXTENSION_TYPES_PLURAL),
        outdir: 'ext',
        bundle: true,
        platform: 'browser',
        target: 'es2021',
        format: 'esm',
        external: APP_SHARED_DEPS,
        plugins: [
            {
                name: 'vue-style',
                setup(build) {
                    const fs = require('fs');
                    const template = css =>
                        `typeof document<'u'&&document.head.appendChild(document.createElement('style')).appendChild(document.createTextNode(${JSON.stringify(css)}));`;
                    // build.onResolve({ filter: /\.vue\?type=style/, }, args => {
                    //     const p = fs.statSync(args.path.split('?')[0]);
                    //     console.log('vue-style', args);
                    //     console.log('vue-style', p);
                    // });
                    build.onLoad({ filter: /\.vue\?type=style/, }, args => {
                        const p = fs.statSync(args.path.split('?')[0]);
                        let css = fs.readFileSync(args.path.split('?')[0], 'utf8');
                        return { contents: template(css) };
                    });
                }
            },
            pluginVue({}),
        ],
    })
        .catch(console.error);
