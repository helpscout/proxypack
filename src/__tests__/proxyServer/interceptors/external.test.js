const externalInterceptor = require('../../../proxyServer/interceptors/external.js')
const proxyServer = require('../../../__mocks__/proxyServer')

describe('externalInterceptor', () => {
  const externalMappings = {
    'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
      'http://localhost:3001/static/js/main.2.1.js',
  }

  const [targetUrl, proxyUrl] = Object.entries(externalMappings)[0]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('expect intercept to call with correct data', () => {
    externalInterceptor.init({
      externalMappings,
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
})
