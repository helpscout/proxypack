function ProxyPackPlugin({
  proxyServer = require('../proxyServer'),
  browser,
  domain,
  externalMappings,
  localMappings,
  webpackMappings,
}) {
  this.proxyServer = proxyServer
  this.proxyServer.init({
    browser,
    domain,
    externalMappings,
    localMappings,
    webpackMappings,
  })
}

ProxyPackPlugin.prototype.apply = function(compiler) {
  this.proxyServer.updateWebpackOutputPath(compiler.options.output.path)
}

module.exports = ProxyPackPlugin
