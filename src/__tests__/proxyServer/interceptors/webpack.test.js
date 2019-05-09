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

  const targetUrl1 = webpackMappings[0]
  const targetUrl2 = webpackMappings[1]
  const webpackOutputPath = '/User/tjbo/projects/hsApp/'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    webpackInterceptor.init({
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
})
