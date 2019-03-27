const path = require('path')

function init({
  logIntercept,
  proxyServer,
  webpackMappings,
  webpackOutputPath,
}) {
  function addInterceptor(targetUrl) {
    function handleInterceptor(request, response, cycle) {
      const filename = path.parse(request.url).base
      logIntercept({
        response,
        request,
        targetUrl: targetUrl,
      })
      return cycle.serve(webpackOutputPath + filename)
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
  webpackMappings && webpackMappings.forEach(addInterceptor)
}

module.exports = {
  init,
}
