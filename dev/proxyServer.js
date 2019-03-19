const proxyServer = require('../src/proxyServer')

proxyServer.init({
  domain: 'https://secure.helpscout.net',
  webpackMappings: [
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
  ],
  localMappings: {
    'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
  },
  webpackAssets: {
    'dashboard.js': 'mock source code',
    'vendors.js': 'mock source code',
  },
})
