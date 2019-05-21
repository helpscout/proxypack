const https = require('https')
const state = require('../proxyServer/state')
const fs = require('fs')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

let isInit = false

const init = function() {
  if (isInit) return

  isInit = true

  const { localSSLDir, webpackOutputPath } = state.get()

  const key = fs.readFileSync(`${localSSLDir}localdev-ssl.key`, 'ascii')
  const cert = fs.readFileSync(`${localSSLDir}localdev-ssl.crt`, 'ascii')

  const options = {
    cert: cert,
    key: key,
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
