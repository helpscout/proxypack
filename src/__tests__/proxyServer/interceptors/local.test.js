const localInterceptor = require('../../../proxyServer/interceptors/local.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('localInterceptor', () => {
  const localMappings = {
    'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
    'https://dhmmnd775wlnp.cloudfront.net/*/js/dashboard.js': `${__dirname}/site/js/dashboard.js`,
  }
  const logInterceptSpy = jest.fn()
  const [targetUrl1, localLocation1] = Object.entries(localMappings)[0]
  const [targetUrl2, localLocation2] = Object.entries(localMappings)[1]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct number of mappings', () => {
    localInterceptor({
      localMappings,
      logIntercept: logInterceptSpy,
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

  it('should call logIntercept', () => {
    localInterceptor({
      localMappings,
      logIntercept: logInterceptSpy,
      proxyServer,
    })
    const cycle = {
      serve: jest.fn(),
    }
    proxyServer.simulate({}, {}, cycle, targetUrl1)
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request: {},
      response: {},
      targetUrl: targetUrl1,
      proxyUrl: localLocation1,
    })
  })
})
