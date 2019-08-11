const CONFIG = require('../constants/config')
const https = require('https')
const state = require('../proxyServer/state')
const fs = require('fs')
let isInit = false

const init = function() {
  if (isInit) return

  isInit = true

  const { webpackCompilerLocalOutputPath, cert } = state.get()

  require('ssl-root-cas')
    .inject()
    .addFile(CONFIG.SSL_CERTS.CA)

  const options = {
    cert: cert.server.cert,
    key: cert.server.key,
  }

  https
    .createServer(options, function(request, response) {
      fs.readFile(webpackCompilerLocalOutputPath + request.url, function(
        err,
        data,
      ) {
        if (!err) {
          response.writeHead(203, { 'proxy-pack-source': 'webpack server' })
          response.write(data || '')
          response.end()
        } else {
          response.writeHead(500)
          response.write(err)
          response.end()
        }
      })
    })
    .listen(CONFIG.LOCAL_WEBPACK_SERVER.PORT)
}

module.exports = {
  init,
}
