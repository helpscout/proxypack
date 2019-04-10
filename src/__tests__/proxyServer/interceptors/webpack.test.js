const webpackInterceptor = require('../../../proxyServer/interceptors/webpack.js')
const proxyServer = require('../../../__mocks__/proxyServer')
jest.mock('fs')
const fs = require('fs')
const errorSpy = jest.spyOn(global.console, 'error')

describe('webpackInterceptor', () => {
  const webpackMappings = [
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
  ]

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

  it('should call logIntercept and set a response', () => {
    webpackInterceptor.init({
      logIntercept: logInterceptSpy,
      proxyServer,
      webpackMappings,
      webpackOutputPath,
    })
    fs.readFileSync.mockReturnValue('source code')
    const request = {
      url:
        'https://dhmmnd775wlnp.cloudfront.net/dddfff333/js/apps/dist/dashboard.js',
    }
    proxyServer.simulate(request, { headers: {} }, {}, targetUrl1)
    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/User/tjbo/projects/hsApp/dashboard.js',
      'utf8',
    )
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request,
      response: {
        headers: {
          'proxypack-type': 'webpack',
        },
        statusCode: 203,
        string: 'source code',
      },
      targetUrl: targetUrl1,
      type: 'webpack',
    })
  })

  it('should throw a console.error', () => {
    webpackInterceptor.init({
      logIntercept: logInterceptSpy,
      proxyServer,
      webpackMappings,
      webpackOutputPath,
    })
    proxyServer.simulate({}, {}, {}, targetUrl1)
    fs.readFileSync.mockReturnValue(null, 'utf8')
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
