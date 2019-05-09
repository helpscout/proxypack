const localInterceptor = require('../../../proxyServer/interceptors/local.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('localInterceptor', () => {
  const localMappings = {
    'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
    'https://dhmmnd775wlnp.cloudfront.net/*/js/dashboard.js': `${__dirname}/site/js/dashboard.js`,
  }
  const [targetUrl1] = Object.entries(localMappings)[0]
  const [targetUrl2] = Object.entries(localMappings)[1]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct number of mappings', () => {
    localInterceptor.init({
      localMappings,
      proxyServer,
    })
    expect(proxyServer.intercept).toHaveBeenCalledTimes(2)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        as: 'string',
        method: 'GET',
        fullUrl: targetUrl1,
        phase: 'request',
      },
      expect.any(Function),
    )
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        as: 'string',
        method: 'GET',
        fullUrl: targetUrl2,
        phase: 'request',
      },
      expect.any(Function),
    )
  })
})
