module.exports = {
    lintOnSave: false,

    pluginOptions: {
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
