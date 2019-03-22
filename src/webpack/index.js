const proxyServer = require('../proxyServer')

function ProxyPackPlugin({
  browser,
  domain,
  externalMappings,
  localMappings,
  webpackMappings,
}) {
  proxyServer.init({
    browser,
    domain,
    externalMappings,
    localMappings,
    webpackMappings,
  })
}

ProxyPackPlugin.prototype.apply = function(compiler) {
  proxyServer.updateWebpackOutputPath(compiler.options.output.path)
}

module.exports = ProxyPackPlugin
