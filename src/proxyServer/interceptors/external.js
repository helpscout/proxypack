const path = require('path')
const axios = require('axios')

function init({ externalMappings, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyPath] = mapping

    function handleInterceptor(request, response) {
      return new Promise((resolve, reject) => {
        const filename = path.parse(request.url).base
        const filepath = proxyPath + filename
        return axios
          .get(filepath, { responseType: 'text' })
          .then(function(_response) {
            response.statusCode = 203
            response.string = _response.data
            response.headers['proxypack-type'] = 'external'
            response.headers['proxypack-url'] = filepath
            logIntercept({
              response,
              request,
              proxyUrl: proxyPath,
              targetUrl,
              type: 'external',
            })
            resolve()
          })
          .catch(function(error) {
            console.log(error)
            reject()
          })
      })
    }

    proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: targetUrl,
      },
      handleInterceptor,
    )
  }
  externalMappings && Object.entries(externalMappings).forEach(addInterceptor)
}

module.exports = {
  init,
}
