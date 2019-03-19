module.exports = function({ proxyServer, externalMappings }) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyUrl] = mapping

    proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: targetUrl,
      },
      (request, response, cycle) => {
        // it seems like returning axios directly doesn't work, which is why there is an extra wrapping here
        // may want to tweak this in the future
        return new Promise((resolve, reject) => {
          return axios
            .get(proxyUrl, { responseType: 'text' })
            .then(_response => {
              response.statusCode = 200
              response.string = _response.data
              resolve()
            })
            .catch(function(error) {
              console.log(error)
              reject()
            })
        })
      },
    )
  }
  externalMappings && Object.entries(externalMappings).forEach(addInterceptor)
}
