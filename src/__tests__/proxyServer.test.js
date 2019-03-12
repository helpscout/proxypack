import ProxyServer from '../proxyServer'

describe('proxyServer', () => {
  let addInterceptForBannerSpy,
    addInterceptForInfoSpy,
    addInterceptForMappingSpy,
    addInterceptForExternalMappingSpy,
    assets = {
      'dashboard.js': 'mock source code',
      'dashboard.js.map': 'mock source code',
    },
    browser = 'firefox',
    domain = 'secure.helpscout.net',
    mappings = ['https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*'],
    externalMappings = {
      'https://beacon-v2.helpscout.net/static/js/main*':
        'http://localhost:3001/static/js/main.2.1.js',
      'https://beacon-v2.helpscout.net/static/js/main.2.1.js.map':
        'http://localhost:3001/static/js/main.2.1.js.map',
    }

  beforeEach(() => {
    addInterceptForBannerSpy = jest.spyOn(
      ProxyServer.prototype,
      'addInterceptForBanner',
    )

    addInterceptForInfoSpy = jest.spyOn(
      ProxyServer.prototype,
      'addInterceptForInfo',
    )

    addInterceptForMappingSpy = jest.spyOn(
      ProxyServer.prototype,
      'addInterceptForMapping',
    )

    addInterceptForExternalMappingSpy = jest.spyOn(
      ProxyServer.prototype,
      'addInterceptForExternalMapping',
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should instantiate correctly when given mappings', () => {
    new ProxyServer({ browser, domain, mappings })
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForMappingSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForExternalMappingSpy).toHaveBeenCalledTimes(0)
  })

  test('should instantiate correctly when given external mappings', () => {
    new ProxyServer({ browser, domain, externalMappings })
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForMappingSpy).toHaveBeenCalledTimes(0)
    expect(addInterceptForExternalMappingSpy).toHaveBeenCalledTimes(2)
  })

  test('should update webpack assets', () => {
    const proxyServer = new ProxyServer({ browser, domain, mappings })
    proxyServer.updateWebpackAssets(assets)
    expect(proxyServer.webpackAssets).toEqual(assets)
  })
})
