const fs = require('fs')
const log = require('../../logger')

function init({ localMappings, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, localLocation] = mapping

    function handleInterceptor(request, response, cycle) {
      try {
        const file = fs.readFileSync(localLocation, 'utf8')
        response.statusCode = 203
        response.string = file
        response.headers['proxypack-interceptor-type'] = 'local'
        log.handleInterceptor({
          proxyUrl: localLocation,
          targetUrl: request.url,
          type: 'local'
      })
      } catch (error) {
        console.log('There was an error fetching a local file.', error)
      }
    }

    proxyServer.intercept(
      {
        method: 'GET',
        phase: 'request',
        as: 'string',
        fullUrl: targetUrl,
      },
      handleInterceptor,
    )
  }
  localMappings && Object.entries(localMappings).forEach(addInterceptor)
}

module.exports = {
  init,
}
