module.exports = function({
  externalMappings,
  getExternalResource,
  proxyServer,
}) {
  function addInterceptor(mapping) {
    const [targetUrl, proxyUrl] = mapping
    function handleInterceptor(request, response) {
      const source = getExternalResource(proxyUrl)
      response.string = source
      response.statusCode = 200
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
