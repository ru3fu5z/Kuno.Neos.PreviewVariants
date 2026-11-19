const esbuild = require('esbuild');
const extensibilityMap = require('@neos-project/neos-ui-extensibility/extensibilityMap.json');

const watch = process.argv.includes('--watch');

const options = {
    logLevel: 'info',
    bundle: true,
    minify: !watch,
    target: 'es2020',
    sourcemap: 'linked',
    entryPoints: {Plugin: 'src/index.js'},
    loader: {'.js': 'jsx'},
    alias: extensibilityMap,
    outdir: '../../Public/JavaScript/PreviewVariants'
};

if (watch) {
    esbuild.context(options).then(ctx => ctx.watch());
} else {
    esbuild.build(options);
}
