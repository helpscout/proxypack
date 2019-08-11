const fs = require('fs')
const log = require('../../logger')
const getLocalPath = require('../../utils/getLocalPath')

function init({ localMappings, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, localLocation] = mapping

    function handleInterceptor(request, response, cycle) {
      const requestUrl = request.url
      let _localLocation = localLocation
      _localLocation = getLocalPath({ localLocation, targetUrl, requestUrl })
      console.log(_localLocation, targetUrl)
      try {
        const file = fs.readFileSync(_localLocation, 'utf8')
        response.statusCode = 203
        response.string = file
        response.headers['proxypack-interceptor-local'] = _localLocation

        log.handleInterceptor({
          proxyUrl: _localLocation,
          targetUrl: request.url,
          type: 'local',
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
