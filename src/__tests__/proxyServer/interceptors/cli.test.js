const cliInterceptor = require('../../../proxyServer/interceptors/cli.js')

describe('cli interceptor', () => {
  const addInterceptorForBannerSpy = jest.fn()
  const port = 8888
  const domain = 'secure.helpscout.net'
  const getStateSpy = jest.fn().mockReturnValue({
    domain,
    port,
  })
  const logInterceptSpy = jest.fn()
  const proxyServer = {
    simulatedCallback: null,
    simulate: function(request, response) {
      return this.simulatedCallback(request, response)
    },
    intercept: jest.fn(function(object, callback) {
      this.simulatedCallback = callback
    }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    cliInterceptor({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getStateSpy,
      proxyServer: proxyServer,
    })
    expect(proxyServer.intercept).toHaveReturnedTimes(1)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        as: 'string',
        fullUrl: 'http://localhost:' + port + '/cli',
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
    cliInterceptor({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getStateSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response)
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
    cliInterceptor({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getStateSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response)
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
    const targetUrl = 'http://localhost:' + port + '/cli'
    cliInterceptor({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getStateSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response)
    expect(logInterceptSpy).toHaveBeenCalledTimes(1)
    expect(logInterceptSpy).toHaveBeenCalledWith({
      request,
      response,
      statusCode: 200,
      targetUrl,
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
    cliInterceptor({
      addInterceptorForBanner: addInterceptorForBannerSpy,
      getState: getStateSpy,
      logIntercept: logInterceptSpy,
      proxyServer: proxyServer,
    })
    proxyServer.simulate(request, response)
    expect(logInterceptSpy).not.toBeCalled()
  })
})
