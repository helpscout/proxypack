const webpackInterceptor = require('../../../proxyServer/interceptors/webpack.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('webpackInterceptor', () => {
  const webpackMappings = [
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
  ]
  const cycleSpy = {
    serve: jest.fn(),
  }

  const logInterceptSpy = jest.fn()
  const targetUrl1 = webpackMappings[0]
  const targetUrl2 = webpackMappings[1]
  const webpackOutputPath = '/User/tjbo/projects/hsApp/'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    webpackInterceptor.init({
      logIntercept: logInterceptSpy,
      proxyServer,
      webpackMappings,
      webpackOutputPath,
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

  it('should call logIntercept and cycle', () => {
    webpackInterceptor.init({
      logIntercept: logInterceptSpy,
      proxyServer,
      webpackMappings,
      webpackOutputPath,
    })
    const request = {
      url:
        'https://dhmmnd775wlnp.cloudfront.net/dddfff333/js/apps/dist/dashboard.js',
    }
    const response = {}
    proxyServer.simulate(request, response, cycleSpy, targetUrl1)
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request,
      response,
      targetUrl: targetUrl1,
    })
    expect(cycleSpy.serve).toHaveBeenCalledTimes(1)
    expect(cycleSpy.serve).toHaveBeenCalledWith(
      '/User/tjbo/projects/hsApp/dashboard.js',
    )
  })
})
