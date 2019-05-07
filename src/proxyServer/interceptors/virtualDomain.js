const fs = require('fs')
const log = require('../../logger')

function init({ domain, proxyServer }) {
  function addInterceptor() {
    function handleInterceptor(request, response, cycle) {
      return new Promise((resolve, reject) => {
        try {
            const localLocation = request.query.redirect
            const file = fs.readFileSync(localLocation, 'utf8')
            response.statusCode = 203
            response.string = file
            response.headers['proxypack-interceptor-type'] = 'virtual'
            log.handleInterceptor({
              type: 'virtualDomain',
              proxyUrl: localLocation,
              targetUrl: domain + '/*',
            })
            resolve()
          } catch (error) {
            log.handleInterceptorError({
              error,
              type: 'virtualDomain',
              proxyUrl: localLocation,
              targetUrl: domain + '/*',
            })
            reject()
          }
        })
    }
    proxyServer.intercept(
      {
        method: 'GET',
        phase: 'request',
        as: 'string',
        fullUrl: domain + '/*',
      },
      handleInterceptor,
    )
  }
  domain && addInterceptor()
}

module.exports = {
  init,
}
