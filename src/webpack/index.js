class ProxyPackPlugin {
  constructor({
    browser,
    domain,
    externalMappings,
    localDist,
    localMappings,
    localWebpackServerURL,
    webpackMappings,
  }) {
    this.opts = {
      fields: ['entrypoints', 'assetsByChunkName'],
    }
    // we load stuff here to make sure that nothing is followed in other
    // environments, unless this plugin has first been instantiated
    this.state = require('../proxyServer/state')
    this.webpackServer = require('./server')
    this.proxyServer = require('../proxyServer')
    this.proxyServer.init({
      browser,
      domain,
      externalMappings,
      localDist,
      localMappings,
      localWebpackServerURL,
      webpackMappings,
    })
  }

  apply(compiler, compilation) {
    this.state.set({
      webpackCompilerLocalOutputPath: compiler.options.output.path,
    })

    if (compiler.hooks) {
      compiler.hooks.emit.tapPromise(
        'proxypack-plugin',
        this.emitStats.bind(this),
      )
    } else {
      compiler.plugin('emit', this.emitStats.bind(this))
    }
  }

  emitStats(curCompiler, callback) {
    let stats = curCompiler.getStats().toJson()

    // Filter stats fields
    if (this.opts.fields) {
      stats = this.opts.fields.reduce((memo, key) => {
        memo[key] = stats[key]
        return memo
      }, {})
    }

    // Transform to string
    let err
    return (
      Promise.resolve()
        .then(() => stats)
        .catch(e => {
          err = e
        })

        // Finish up.
        .then(statsStr => {
          // Handle errors.
          if (err) {
            curCompiler.errors.push(err)
            if (callback) {
              return void callback(err)
            }
            throw err
          }

          this.state.set({
            webpackEntries: statsStr.entrypoints,
            assetsByChunkName: statsStr.assetsByChunkName,
          })
          this.webpackServer.init()
          if (callback) {
            return void callback()
          }
        })
    )
  }
}

module.exports = ProxyPackPlugin
