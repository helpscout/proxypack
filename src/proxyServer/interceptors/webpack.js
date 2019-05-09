const path = require('path')
const fs = require('fs')
const log = require('../../logger')

function init({
  proxyServer,
  webpackMappings,
  webpackOutputPath,
}) {
  function addInterceptor(targetUrl) {
    function handleInterceptor(request, response) {
      try {
        const filename = path.parse(request.url).base
        const webpackFile = fs.readFileSync(
          webpackOutputPath + filename,
          'utf8',
        )
        if (webpackFile) {
          response.statusCode = 203
          response.string = webpackFile
          response.headers['proxypack-type'] = 'webpack'
          log.handleInterceptor({
            proxyUrl: webpackOutputPath + filename,
            targetUrl: request.url,
            type: 'webpack'
        })
        }
      } catch (error) {
        console.error('There was an error serving a webpack file.', error)
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
  webpackMappings && webpackMappings.forEach(addInterceptor)
}

module.exports = {
  init,
}
