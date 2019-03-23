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
  externalMappings: {
    'https://beacon-v2.helpscout.net/static/js/main*':
      'http://localhost:3001/static/js/main.2.1.js',
  },
})
