var path = require('path');
var Path = require('path');

module.exports = {
  lintOnSave: false,
  pwa:{
    name: 'Convert',
    themeColor: '#000000',
    backgroundColor:"#000000",
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#000000',
    workboxOptions: {
      exclude: [
        /\.png/,
        /\.html/,
        'manifest.json'
      ]
    },
    icons: [
            {
                'src': 'icons/android-chrome-192x192.png',
                'sizes': '192x192',
                'type': 'image/png',
            },
            {
                'src': 'icons/android-chrome-512x512.png',
                'sizes': '512x512',
                'type': 'image/png',
            },
        ],
    manifestOptions: {
        name: 'Aaron Lumsden',
        short_name: 'Aaron',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#000000'
    },
    iconPaths: {
        favicon32: 'img/icons/favi222con-32x32.png',
        favicon16: 'img/icons/favicon-16x16.png',
        appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
        maskIcon: 'img/icons/safari-pinned-tab.svg',
        msTileImage: 'img/icons/msapplication-icon-144x144.png'
      }
  },
  css: {
    loaderOptions: {
      less: {
        globalVars: {
          color1: '#07beb8'
        }
      }
    }
  },
  configureWebpack: {
    output: {
      path: __dirname + "/dist"
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins : [
      /*
      new PrerenderSPAPlugin({
      staticDir: __dirname + '/dist',
        routes: [
          '/',
        ],
      renderer: new Renderer({
          headless: true,
          renderAfterTime: 3000,
          renderAfterDocumentEvent: 'custom-render-trigger'
        })
      })
      */

    ]
  }
};
