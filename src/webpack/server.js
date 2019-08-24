const CONFIG = require('../constants/config')
const getLocalFile = require('../utils/getLocalFile')
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
      const path = `${webpackCompilerLocalOutputPath}${request.url}`

      getLocalFile(path)
        .then(file => {
          response.writeHead(203, {
            'proxy-pack-webpack-server': path,
            'content-type': file.contentType,
          })
          response.write(file.buffer || '')
          response.end()
        })
        .catch(err => {
          response.writeHead(500)
          response.write(err)
          response.end()
        })
    })
    .listen(CONFIG.LOCAL_WEBPACK_SERVER.PORT)
}

module.exports = {
  init,
}
