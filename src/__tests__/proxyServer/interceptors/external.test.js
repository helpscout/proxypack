const externalInterceptor = require('../../../proxyServer/interceptors/external.js')
const proxyServer = require('../../../__mocks__/proxyServer')

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

describe('externalInterceptor', () => {
  const externalMappings = {
    'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
      'http://localhost:3001/static/js/main.2.1.js',
  }

  const [targetUrl, proxyUrl] = Object.entries(externalMappings)[0]

  function getExternalResource() {
    return {
      [proxyUrl]: 'source code',
    }
  }

  const logInterceptSpy = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    externalInterceptor.init({
      externalMappings,
      getExternalResource,
      logIntercept: logInterceptSpy,
      proxyServer,
    })
    expect(proxyServer.intercept).toHaveReturnedTimes(1)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        as: 'string',
        method: 'GET',
        fullUrl: targetUrl,
        phase: 'request',
      },
      expect.any(Function),
    )
  })

  // it('should call logIntercept', () => {
  //   const request = {
  //     url: targetUrl,
  //     headers: {},
  //   }
  //   const response = {
  //     headers: {},
  //   }
  //   externalInterceptor.init({
  //     externalMappings,
  //     logIntercept: logInterceptSpy,
  //     proxyServer,
  //   })

  //   moxios.stubRequest('/say/hello', {
  //     status: 200,
  //     responseText: 'hello'
  //   })

  //   proxyServer.simulate(request, response, {}, targetUrl)
  //   // next tick
  //   return flushPromises().then(() => {
  //     expect(logInterceptSpy).toHaveBeenCalledTimes(1)
  //     expect(logInterceptSpy).toHaveBeenCalledWith({
  //       request,
  //       response,
  //       targetUrl,
  //       proxyUrl,
  //       type: 'external',
  //     })
  // })
  // })
})
