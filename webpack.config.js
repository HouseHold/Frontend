const Encore = require('@symfony/webpack-encore');
const path = require('path');
const fs = require('fs');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

const outputPath = fs.existsSync('../public/index.php')
    ? path.resolve('../public/build/')
    : path.resolve('./dist');


console.log(outputPath);
Encore
    // directory where compiled assets will be stored
    .setOutputPath(outputPath)
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    .setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('vue', './src/main.ts')
    //.addEntry('page1', './assets/js/page1.js')
    //.addEntry('page2', './assets/js/page2.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications(!Encore.isProduction())
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    .configureBabel(() => {}, {
        useBuiltIns: 'usage',
        corejs: 3
    })

    // Fix @sign.
    .addAliases({
        '@': path.resolve('src')
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    .enableVueLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())
;

const fullConfig = Encore.getWebpackConfig();
fullConfig.name = 'full';
fullConfig.watchOptions = {
    poll: true,
    //ignored: /node_modules/
};
fullConfig.devServer = {
    public: 'localhost:8080',
    allowedHosts: ['localhost:8080'],
    contentBase: path.resolve(__dirname, './public'),
    watchContentBase: true,
    compress: true,
    open: false,
    overlay: true,
    disableHostCheck: true,
    progress: true,
    hot: true,
    hotOnly: true,
    http2: true,
    https: true,
    writeToDisk: true,
    watchOptions: {
        watch: true,
        poll: true
    }
};

module.exports = fullConfig;
