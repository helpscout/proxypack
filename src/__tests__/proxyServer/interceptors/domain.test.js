const domainInterceptor = require('../../../proxyServer/interceptors/domain.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('webpackInterceptor', () => {
  const domain = 'test.com'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    domainInterceptor.init({
      domain,
      proxyServer,
    })
    expect(proxyServer.intercept).toHaveBeenCalledTimes(1)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        phase: 'response',
        responseMimeType: 'text/html',
        fullUrl: domain + '/*',
        as: '$',
      },
      expect.any(Function),
    )
  })

  it('expect response to prepend the banner', () => {
    const eachSpy = jest.fn()
    const prependSpy = jest.fn()
    const request = {}

    const response = {
      headers: {
        'proxypack-interceptor-type': 'banner',
      },
      $: jest.fn(() => ({
        prepend: prependSpy,
        each: eachSpy,
      })),
    }

    domainInterceptor.init({
      domain,
      getVirtualAssetURIsForWebpackEntry: jest.fn(),
      proxyServer,
    })

    proxyServer.simulate(request, response, {}, domain + '/*')
    expect(prependSpy).toHaveBeenCalledTimes(1)
  })
})
