function init({
  externalMappings,
  getExternalResource,
  logIntercept,
  proxyServer,
}) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyUrl] = mapping

    function handleInterceptor(request, response) {
      try {
        const source = getExternalResource(proxyUrl)
        response.string = source
        response.statusCode = 203
        response.headers['proxypack-type'] = 'external'
        logIntercept({
          request,
          response,
          targetUrl,
          proxyUrl,
          type: 'external',
        })
      } catch (error) {
        console.error('Failed to serve an external resource.', error)
      }
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
