const fs = require('fs')

module.exports = function({ proxyServer, localMappings }) {
  function addInterceptor(mapping) {
    const [targetUrl, localLocation] = mapping
    proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: targetUrl,
      },
      (request, response, cycle) => {
        try {
          const file = fs.readFileSync(localLocation, 'utf8')
          response.statusCode = 200
          response.string = file
        } catch (error) {
          console.log(
            'There was an error fetching a local file: ',
            localLocation,
          )
        }
      },
    )
  }
  localMappings && Object.entries(localMappings).forEach(addInterceptor)
}
