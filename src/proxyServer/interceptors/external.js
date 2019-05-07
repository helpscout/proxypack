const path = require('path')
const axios = require('axios')

function init({ cachingRef, externalMappings, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyPath] = mapping

    function handleInterceptor(request, response) {
      if (!request.url) {
        return
      }

      return new Promise((resolve, reject) => {
        let filename, filepath
        try {
          filename = path.parse(request.url).base
          filepath = proxyPath + filename + '?' + 'uid=' + cachingRef
        } catch (error) {
          throw new Error(
            'ProxyPack externalMappingsInterceptor error',
            request.url,
          )
        }

        return axios
          .get(filepath, { responseType: 'text' })
          .then(function(_response) {
            if (typeof _response.data !== 'string') {
              throw new Error(
                'ProxyPack externalMappingsInterceptor error, not a string' +
                  request.url,
              )
            }
            response.statusCode = 203
            response.string = _response.data
            response.headers['proxypack-interceptor-type'] = 'external'
            response.headers['proxypack-url'] = filepath
            resolve()
          })
          .catch(function(error) {
            console.log(error)
            reject()
          })
      }).catch(error => {
        console.log('rejected', error)
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
