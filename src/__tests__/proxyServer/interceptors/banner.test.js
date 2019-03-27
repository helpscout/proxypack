const bannerInterceptor = require('../../../proxyServer/interceptors/banner.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('webpackInterceptor', () => {
  const domain = 'test.com'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    bannerInterceptor.init({
      domain,
      proxyServer,
    })
    expect(proxyServer.intercept).toHaveBeenCalledTimes(1)
    expect(proxyServer.intercept).toHaveBeenCalledWith(
      {
        contentType: 'text/html; charset=UTF-8',
        phase: 'response',
        fullUrl: domain + '/*',
        as: '$',
      },
      expect.any(Function),
    )
  })

  it('expect response to prepend the banner', () => {
    const prependSpy = jest.fn()
    const request = {}

    const response = {
      $: jest.fn(() => ({
        prepend: prependSpy,
      })),
    }

    bannerInterceptor.init({
      domain,
      proxyServer,
    })

    proxyServer.simulate(request, response, {}, domain + '/*')
    expect(prependSpy).toHaveBeenCalledTimes(1)
  })
})
