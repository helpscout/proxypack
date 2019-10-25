class ProxyPackPlugin {
  constructor({
    browser,
    domain,
    externalMappings,
    localDist,
    localMappings,
    localWebpackServerURL,
  }) {
    this.opts = {
      fields: ['entrypoints', 'assetsByChunkName'],
    }
    /* In the past ProxyPack has blown up in other environments. They seem to
    follow and execute all our files on include. (for example jenkins). I'm not
    sure if it's a webpack problem or a jenkins problem, but it seems like the
    safest way to deal with this is to not require things until we've
    instantiated the plugin
    */
    this.state = require('../proxyServer/state')
    this.webpackServer = require('./server')
    this.proxyServer = require('../proxyServer')

    const { getHook, isLegacyTapable } = require('./utils')
    this.getHook = getHook
    this.isLegacyTapable = isLegacyTapable

    const { LOCAL_WEBPACK_SERVER, PLUGIN_NAME } = require('../constants/config')
    this.LOCAL_WEBPACK_SERVER = LOCAL_WEBPACK_SERVER
    this.PLUGIN_NAME = PLUGIN_NAME

    this.proxyServer.init({
      browser,
      domain,
      externalMappings,
      localDist,
      localMappings,
      localWebpackServerURL,
    })
  }

  apply(compiler) {
    this.state.set({
      webpackCompilerLocalOutputPath: compiler.options.output.path,
    })

    this.getHook(compiler, 'compilation')(this.replacePublicPath.bind(this))
    this.getHook(compiler, 'emit')(this.emitStats.bind(this))
  }

  /* Borrowed from: https://www.npmjs.com/package/webpack-require-from
    Webpack allows to automatically split and load code using require.ensure or
   dynamic import import(). Those modules are fetched on-demand when your main
   bundle is running in browser. Webpack loads the modules (chunks) from a static
   URL, which is determined by config.output.publicPath of webpack configuration.

   In this case we are overwritting this path to make sure that dynamic imports
   are resolved via ProxyPack's local node server.

   This url is injected into the web browser, via the domain interceptor,
   but since webpack compiles this path we also need to make reference to it
   in source code..
  */
  replacePublicPath(compiler) {
    const { mainTemplate } = compiler
    this.getHook(mainTemplate, 'require-extensions')((source, chunk, hash) => {
      const buildCode = [
        'try {',
        `  return '${this.LOCAL_WEBPACK_SERVER.URI}/';`,
        '} catch (e) {',
        `console.error("${
          this.PLUGIN_NAME
        }: There was a problem with the public path.")`,
        '}',
      ].join('\n')

      return [
        source,
        `// ProxyPackDynamicUrl`,
        'Object.defineProperty(' + mainTemplate.requireFn + ', "p", {',
        '  get: function () {',
        buildCode,
        ' }',
        '})',
      ].join('\n')
    })
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
