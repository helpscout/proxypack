const ProxyPackPlugin = require('../../webpack')

const compiler = {
  options: {
    output: {
      path: '/Users/SteveAoki/sites/hsapp/',
    },
  },
}

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

describe('webpack proxy pack plugin', () => {
  it('should be defined', () => {
    const proxyPackPlugin = new ProxyPackPlugin({
      browser,
      domain,
      externalMappings,
      localMappings,
      proxyServer,
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
  it('shoud call updateWebpackOutputPath', () => {
    const proxyPackPlugin = new ProxyPackPlugin({ proxyServer })
    proxyPackPlugin.apply(compiler)
    expect(updateWebpackOutputPathSpy).toHaveBeenCalledTimes(1)
    expect(updateWebpackOutputPathSpy).toHaveBeenCalledWith(
      compiler.options.output.path,
    )
  })
})
