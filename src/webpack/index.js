class ProxyPackPlugin {
  constructor({ browser, domain, dynamicMappings, externalMappings, localMappings, webpackMappings, useReplaceScriptBlockWithWebpackEntries }) {
    this.opts = {
      fields: ['entrypoints', 'assetsByChunkName']
    }
    this.proxyServer = require('../proxyServer')
    this.proxyServer.init({
      browser,
      domain,
      dynamicMappings,
      externalMappings,
      localMappings,
      webpackMappings,
      useReplaceScriptBlockWithWebpackEntries
    })
  }

  apply(compiler, compilation) {
    this.proxyServer.updateWebpackOutputPath(compiler.options.output.path)

    if (compiler.hooks) {
      compiler.hooks.emit.tapPromise('proxypack-plugin', this.emitStats.bind(this))
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
    let err;
    return Promise.resolve()
      .then(() => stats)
      .catch((e) => { err = e })

      // Finish up.
      .then((statsStr) => {
        // Handle errors.
        if (err) {
          curCompiler.errors.push(err)
          if (callback) { return void callback(err) }
          throw err
        }

        this.proxyServer.updateWebpackEntries(statsStr.entrypoints)
        this.proxyServer.updateWebpackAssetsByChunkName(statsStr.assetsByChunkName)

        if (callback) { return void callback() }
      })
  }
}

module.exports = ProxyPackPlugin
