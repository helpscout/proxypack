const proxyServer = require('../src/proxyServer')

proxyServer.init({
  browser: 'chrome',
  domain: 'https://secure.helpscout.net',
  externalMappings: {
    'https://*.cloudfront.net/*/js/apps/dist/*':
      'https://proxypackapp.netlify.com/',
  },
})
