// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    sitEnv: require('./sit.env'),
    prodEnv: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',          //请根据自己路径配置更改
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {

    env: require('./dev.env'),
    port: 8079,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {

      // '/api/admin/group':{
      //   target: 'http://oa.91118.com:8765',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '': ''
      //   },
      // },
      // '/api/admin/mobilemenu/saveMobileMenu':{
      //   target: 'http://oa.91118.com:8765',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '': ''
      //   },
      // },
      // '/api/admin/mobilemenu/mobilexxttree':{
      //   target: 'http://oa.91118.com:8765',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/api'
      //   },
      // },
      
      // '/api/auth':{
      //   target: 'http://lcyhqqxx.91sst.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/auth': '/api/auth'
      //   },
      // },
      // '/api/evaluation':{
      //   target: 'http://192.168.0.185:6008',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/evaluation': ''
      //   },
      // },

      '/api':{
        // target: 'http://60.191.57.102:8765',
        // target: 'http://192.168.0.116:8765',
        // target: 'http://192.168.0.157:8765',
        target: 'http://192.168.3.20:8765',
        // target: 'http://192.168.0.185:6008',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
      },
      /*'/api/auth':{
        target: 'http://192.168.0.193:9777',
        changeOrigin: true,
        pathRewrite: {
          '^/api/auth': ''
        },
      },
      '/api/admin':{
        target: 'http://127.0.0.1:8762',
        changeOrigin: true,
        pathRewrite: {
          '^/api/admin': ''
        },
      },
      '/api/base':{
        target: 'http://127.0.0.1:6002',
        // target: 'http://192.168.0.193:8765',
        changeOrigin: true,
        pathRewrite: {
          '^/api/base': ''
        },
      },
      '/api/newborn': {
        target: 'http://192.168.0.203:6162',
        changeOrigin: true,
        pathRewrite: {
          '^/api/newborn': ''
        },
      },*/
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
