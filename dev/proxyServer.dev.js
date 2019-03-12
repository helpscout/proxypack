// `node proxyServer.dev.js`
// this file is mainly used to dev on without going through the process of waiting for webpack
const ProxyServer = require('../src/proxyServer')
const mappings = {
  'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*': 'webpack',
}

const proxyServer = new ProxyServer({ port: 7777, mappings })

// just some fake files to serve up
// since they exist in the web browser at the above mapped domain
const files = {
  'dashboard.js': 'mock source code',
  'vendors.js': 'mock source code',
}

proxyServer.updateWebpackAssets(files)
