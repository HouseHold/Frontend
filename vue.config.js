module.exports = {
    lintOnSave: false,
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            enableInSFC: false
        },
        express: {
            shouldServeApp: true,
            serverDir: './srv'
        },
        autoRouting: {
            chunkNamePrefix: 'page-'
        }
    },
    transpileDependencies: ['vuex-module-decorators']
};
