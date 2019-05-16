const https = require('https')
const state = require('../proxyServer/state')
const fs = require('fs')
const mime = require('mime')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

let isInit = false

const init = function() {
  if (isInit) return

  isInit = true

  const { certAuthority, webpackOutputPath } = state.get()

  const options = {
    key: certAuthority.key,
    cert: certAuthority.cert,
  }

  https
    .createServer(options, function(request, response) {
      fs.readFile(webpackOutputPath + request.url, function(err, data) {
        if (!err) {
          response.writeHead(203)
          response.write(data || '')
          response.end()
        } else {
          response.writeHead(500)
          response.write(err)
          response.end()
        }
      })
    })
    .listen(27777)
}

module.exports = {
  init,
}
