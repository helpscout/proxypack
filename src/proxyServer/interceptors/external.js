function init({
  externalMappings,
  getExternalResource,
  logIntercept,
  proxyServer,
}) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyUrl] = mapping

    function handleInterceptor(request, response) {
      const source = getExternalResource(proxyUrl)
      response.string = source
      response.statusCode = 203
      logIntercept({
        request,
        response,
        targetUrl,
        proxyUrl,
        type: 'external',
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
