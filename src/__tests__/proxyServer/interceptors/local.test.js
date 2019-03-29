const localInterceptor = require('../../../proxyServer/interceptors/local.js')
const proxyServer = require('../../../__mocks__/proxyServer')
jest.mock('fs')
const fs = require('fs')

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
    localInterceptor.init({
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
    localInterceptor.init({
      localMappings,
      logIntercept: logInterceptSpy,
      proxyServer,
    })
    fs.readFileSync.mockReturnValue('source code')
    proxyServer.simulate({}, { headers: {} }, () => {}, targetUrl2)
    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(fs.readFileSync).toHaveBeenCalledWith(localLocation2, 'utf8')
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request: {},
      response: {
        headers: {
          'proxypack-type': 'local',
        },
        statusCode: 203,
        string: 'source code',
      },
      targetUrl: targetUrl2,
      type: 'local',
      proxyUrl: localLocation2,
    })
  })
})
