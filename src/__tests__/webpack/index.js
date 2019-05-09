const ProxyPackPlugin = require('../../webpack')

const compiler = {
  options: {
    output: {
      path: '/Users/SteveAoki/sites/hsapp/',
    },
  },
}

const _proxyServer = jest.mock('hoxy', () => {
  return {
    createServer: function() {
      return this
    },
    listen: function(port, callback) {
      callback(_proxyServer)
      return this
    },
  }
})

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

const initSpy = jest.fn()
const updateWebpackOutputPathSpy = jest.fn()
const proxyServer = {
  init: initSpy,
  updateWebpackOutputPath: updateWebpackOutputPathSpy,
}

jest.mock('../proxyServer', function() {
  return proxyServer
})

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
