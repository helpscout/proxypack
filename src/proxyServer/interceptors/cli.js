// info is requested by the CLI command
module.exports = function({ addInterceptorForBanner, getState, proxyServer }) {
  function addInterceptor() {
    const { port } = getState()
    proxyServer.intercept(
      {
        phase: 'request',
        fullUrl: 'http://localhost:' + port + '/cli',
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
        }
      },
    )
  }
  addInterceptor()
}
