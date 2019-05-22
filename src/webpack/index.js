const state = require('../proxyServer/state')
const webpackServer = require('./server')

class ProxyPackPlugin {
  constructor({
    browser,
    domain,
    externalMappings,
    localDist,
    localMappings,
    localSSLDir,
    localWebpackServerURL,
    webpackMappings,
  }) {
    this.opts = {
      fields: ['entrypoints', 'assetsByChunkName'],
    }
    this.proxyServer = require('../proxyServer')
    this.proxyServer.init({
      browser,
      domain,
      externalMappings,
      localDist,
      localMappings,
      localSSLDir,
      localWebpackServerURL,
      webpackMappings,
    })
  }

  apply(compiler, compilation) {
    state.set({ webpackOutputPath: compiler.options.output.path })

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

          state.set({
            webpackEntries: statsStr.entrypoints,
            assetsByChunkName: statsStr.assetsByChunkName,
          })
          webpackServer.init()
          if (callback) {
            return void callback()
          }
        })
    )
  }
}

module.exports = ProxyPackPlugin
