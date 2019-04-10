const proxyServer = require('../../../__mocks__/proxyServer')
const cliInterceptor = require('../../../proxyServer/interceptors/cli.js')

describe('cliInterceptor', () => {
  const addInterceptorForBannerSpy = jest.fn()
  const port = 8888
  const domain = 'secure.helpscout.net'
  const getSpy = jest.fn().mockReturnValue({
    domain,
    port,
  })
  const logInterceptSpy = jest.fn()
  const targetUrl = 'localhost:8888/cli'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    cliInterceptor.init({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
      targetUrl,
    })
    expect(proxyServer.intercept).toHaveReturnedTimes(1)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        as: 'string',
        fullUrl: targetUrl,
        phase: 'request',
      },
      expect.any(Function),
    )
  })

  it('addInterceptForBanner should call with correct domain', () => {
    const request = {
      url: '/cli',
      headers: {
        domain: 'test.com',
      },
    }
    const response = {
      headers: {},
    }
    cliInterceptor.init({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
      targetUrl,
    })
    proxyServer.simulate(request, response, {}, targetUrl)
    expect(addInterceptorForBannerSpy).toHaveBeenCalledWith('test.com')
  })

  it('addInterceptForBanner should not call', () => {
    const request = {
      url: '/cli',
      headers: {},
    }
    const response = {
      headers: {},
    }
    cliInterceptor.init({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response, {}, targetUrl)
    expect(addInterceptorForBannerSpy).not.toBeCalled()
  })

  it('should call logIntercept', () => {
    const request = {
      url: '/cli',
      headers: {},
    }
    const response = {
      headers: {},
    }
    cliInterceptor.init({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response, {}, targetUrl)
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request,
      response,
      targetUrl,
      type: 'cli',
    })
  })

  it('should not call logIntercept', () => {
    const request = {
      url: '/other',
      headers: {},
    }
    const response = {
      headers: {},
    }
    cliInterceptor.init({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response, null, targetUrl)
    expect(logInterceptSpy).not.toBeCalled()
  })
})
