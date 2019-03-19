const path = require('path')

module.exports = function({ proxyServer, webpackMappings, getWebpackAsset }) {
  function addInterceptor(targetUrl) {
    proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: targetUrl,
      },
      (request, response, cycle) => {
        const filename = path.parse(request.url).base
        const webpackFile = getWebpackAsset(filename)
        if (webpackFile) {
          response.statusCode = 203
          response.string = webpackFile
        }
      },
    )
  }
  webpackMappings && webpackMappings.forEach(addInterceptor)
}
