const fs = require('fs')
const log = require('../../logger')
const getLocalPath = require('../../utils/getLocalPath')
const getLocalFile = require('../../utils/getLocalFile')

function init({ localMappings, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, localLocation] = mapping

    function handleInterceptor(request, response, cycle) {
      const requestUrl = request.url
      let _localLocation = localLocation
      _localLocation = getLocalPath({ localLocation, targetUrl, requestUrl })

      return getLocalFile(_localLocation).then(file => {
        response.statusCode = 203
        response.buffer = file
        response.headers['proxypack-interceptor-local'] = _localLocation

        log.handleInterceptor({
          proxyUrl: _localLocation,
          targetUrl: request.url,
          type: 'local',
        })
      })
    }

    proxyServer.intercept(
      {
        method: 'GET',
        phase: 'request',
        as: 'buffer',
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
