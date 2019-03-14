const ProxyServer = require('../proxyServer')
const fs = require('fs')
const path = require('path')

const interceptSpy = jest.fn(),
  onSpy = jest.fn(),
  addInterceptForBannerSpy = jest.spyOn(
    ProxyServer.prototype,
    'addInterceptForBanner',
  ),
  addInterceptForInfoSpy = jest.spyOn(
    ProxyServer.prototype,
    'addInterceptForInfo',
  ),
  addInterceptForLocalMappingSpy = jest.spyOn(
    ProxyServer.prototype,
    'addInterceptForLocalMapping',
  ),
  addInterceptForWebpackMappingSpy = jest.spyOn(
    ProxyServer.prototype,
    'addInterceptForWebpackMapping',
  ),
  addInterceptForExternalMappingSpy = jest.spyOn(
    ProxyServer.prototype,
    'addInterceptForExternalMapping',
  ),
  assets = {
    'dashboard.js': 'mock source code',
    'dashboard.js.map': 'mock source code',
  },
  browser = 'firefox',
  domain = 'secure.helpscout.net',
  mappings = [
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
    'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
  ],
  externalMappings = {
    'https://beacon-v2.helpscout.net/static/js/main*':
      'http://localhost:3001/static/js/main.2.1.js',
    'https://beacon-v2.helpscout.net/static/js/main.2.1.js.map':
      'http://localhost:3001/static/js/main.2.1.js.map',
  },
  listenSpy = jest.fn(() => {
    return {
      intercept: interceptSpy,
      on: onSpy,
    }
  }),
  localMappings = {
    'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
  }

function Proxy() {
  return {
    listen: listenSpy,
  }
}

let hoxy = {
  createServer: function() {
    return new Proxy()
  },
}

let proxyServer

describe('proxyServer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should instantiate correctly when given mappings', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForWebpackMappingSpy).toHaveBeenCalledTimes(2)
    expect(addInterceptForExternalMappingSpy).toHaveBeenCalledTimes(0)
    expect(interceptSpy).toHaveBeenCalledTimes(4)
    expect(onSpy).toHaveBeenCalledTimes(1)
    expect(listenSpy).toHaveBeenCalledTimes(1)
  })

  test('should instantiate correctly when given external mappings', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, externalMappings })
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForWebpackMappingSpy).toHaveBeenCalledTimes(0)
    expect(addInterceptForExternalMappingSpy).toHaveBeenCalledTimes(2)
    expect(interceptSpy).toHaveBeenCalledTimes(4)
    expect(listenSpy).toHaveBeenCalledTimes(1)
  })

  test('should instantiate correctly when given local mappings', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, localMappings })
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(addInterceptForWebpackMappingSpy).toHaveBeenCalledTimes(0)
    expect(addInterceptForLocalMappingSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy).toHaveBeenCalledTimes(3)
    expect(listenSpy).toHaveBeenCalledTimes(1)
  })

  test('should have an SSL cert', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    const keyFile = fs.readFileSync(
      path.resolve(__dirname, '../proxypack.key.pem'),
    )
    const certFile = fs.readFileSync(
      path.resolve(__dirname, '../proxypack.crt.pem'),
    )
    expect(proxyServer.options.certAuthority.key).toEqual(keyFile)
    expect(proxyServer.options.certAuthority.cert).toEqual(certFile)
  })

  test('addInterceptForInfo', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    jest.clearAllMocks()
    proxyServer.addInterceptForInfo()
    expect(addInterceptForInfoSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy.mock.calls[0][0]).toEqual({
      phase: 'request',
      fullUrl: 'http://localhost:7777/info',
      as: 'string',
    })
  })

  test('addInterceptForBanner', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    jest.clearAllMocks()
    proxyServer.addInterceptForBanner()
    expect(addInterceptForBannerSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy.mock.calls[0][0]).toEqual({
      contentType: 'text/html; charset=UTF-8',
      phase: 'response',
      fullUrl: proxyServer.domain + '/*',
      as: '$',
    })
  })

  test('addInterceptForLocalMapping', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, localMappings })
    jest.clearAllMocks()
    proxyServer.addInterceptForLocalMapping(Object.keys(localMappings)[0])
    expect(interceptSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy.mock.calls[0][0]).toEqual({
      phase: 'request',
      method: 'GET',
      as: 'string',
      fullUrl: Object.keys(localMappings)[0],
    })
  })

  test('addInterceptForExternalMapping', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, externalMappings })
    jest.clearAllMocks()
    proxyServer.addInterceptForExternalMapping(Object.keys(externalMappings)[0])
    expect(interceptSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy.mock.calls[0][0]).toEqual({
      phase: 'request',
      method: 'GET',
      as: 'string',
      fullUrl: Object.keys(externalMappings)[0],
    })
  })

  test('addInterceptForWebpackMapping', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    jest.clearAllMocks()
    proxyServer.addInterceptForWebpackMapping(Object.keys(mappings)[0])
    expect(interceptSpy).toHaveBeenCalledTimes(1)
    expect(interceptSpy.mock.calls[0][0]).toEqual({
      phase: 'request',
      method: 'GET',
      as: 'string',
      fullUrl: Object.keys(mappings)[0],
    })
  })

  test('updateWebpackAssets', () => {
    proxyServer = new ProxyServer({ browser, domain, hoxy, mappings })
    proxyServer.updateWebpackAssets(assets)
    expect(proxyServer.webpackAssets).toEqual(assets)
  })
})
