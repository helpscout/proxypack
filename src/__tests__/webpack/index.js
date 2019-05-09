const ProxyPackPlugin = require('../../webpack')
jest.mock('../../rpcServer')
jest.mock('../../proxyServer')

const browser = 'firefox'
const domain = 'https://secure.helpscout.net'
const webpackMappings = [
  'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
  'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
]
const localMappings = {
  'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
}
const externalMappings = {
  'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
    'http://localhost:3001/static/js/main.2.1.js',
}

describe('webpack proxy pack plugin', () => {
  it('should be defined', () => {
    const proxyPackPlugin = new ProxyPackPlugin({
      browser,
      domain,
      externalMappings,
      localMappings,
      webpackMappings,
    })
    expect(proxyPackPlugin).toBeDefined()
    const initSpy = jest.spyOn(proxyPackPlugin.proxyServer, 'init')
    expect(initSpy).toHaveBeenCalledTimes(1)
    expect(initSpy).toHaveBeenCalledWith({
      browser,
      domain,
      externalMappings,
      localMappings,
      webpackMappings,
    })
  })
})
