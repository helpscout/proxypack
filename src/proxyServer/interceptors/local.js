module.exports = function({ localMappings, logIntercept, proxyServer }) {
  function addInterceptor(mapping) {
    const [targetUrl, localLocation] = mapping

    function handleInterceptor(request, response, cycle) {
      logIntercept({
        response,
        request,
        proxyUrl: localLocation,
        targetUrl,
      })
      return cycle.serve(localLocation)
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
