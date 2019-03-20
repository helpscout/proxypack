// info is requested by the CLI command
module.exports = function({
  addInterceptorForBanner,
  getState,
  logIntercept,
  proxyServer,
}) {
  function addInterceptor() {
    const { port } = getState()
    const targetUrl = 'http://localhost:' + port + '/cli'

    proxyServer.intercept(
      {
        phase: 'request',
        fullUrl: targetUrl,
        as: 'string',
      },
      (request, response) => {
        const state = getState()
        // if there is a domain in this header, sent from the cli, use that instead to match against on the intercept
        const domainInHeader = request.headers['domain']

        if (domainInHeader && state.domain !== domainInHeader) {
          addInterceptorForBanner(domainInHeader)
        }

        if (request.url === '/cli') {
          console.log(`A ProxyPack browser connected.`)
          response.statusCode = 200
          response.string = JSON.stringify(state)
          logIntercept({
            request,
            response,
            statusCode: 200,
            targetUrl,
          })
        }
      },
    )
  }
  addInterceptor()
}
