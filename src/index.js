module.exports = {
  WebpackPlugin: require('./webpack/index'),
  Server: function() {
    return require('./proxyServer/index')
  },
}
