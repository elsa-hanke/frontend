module.exports = {
  lintOnSave: "default",

  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      }
    }
  },

  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    port: 9060,
    proxy: {
      // Gateway
      "/api": {
        target: "http://localhost:8080",
        secure: false
      },
      // Other microservices
      "/services": {
        target: "http://localhost:8080",
        secure: false
      },
      // UAA
      "/auth": {
        target: "http://localhost:8080",
        secure: false
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: "fi",
      fallbackLocale: "fi",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
