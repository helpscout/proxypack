const hoxy = require('hoxy')
const bannerInterceptor = require('./interceptors/banner')
const cliInterceptor = require('./interceptors/cli')
const externalInterceptor = require('./interceptors/external')
const localInterceptor = require('./interceptors/local')
const rpcServer = require('../rpcServer/index')
const webpackInterceptor = require('./interceptors/webpack')
const state = require('./state')

function addInterceptorForBanner({ proxyServer, domain }) {
  bannerInterceptor.init({ proxyServer, domain })
}

const { certAuthority, port } = state.get()

const proxyServer = hoxy
  .createServer({ certAuthority })
  .listen(port, status => {
    const {
      domain,
      externalMappings,
      localMappings,
      webpackOutputPath,
      webpackMappings,
    } = state.get()
    externalInterceptor.init({
      externalMappings,
      logIntercept: state.logIntercept,
      proxyServer,
    })
    webpackMappings &&
      webpackInterceptor.init({
        logIntercept: state.logIntercept,
        proxyServer,
        webpackMappings,
        webpackOutputPath,
      })
    localMappings &&
      localInterceptor.init({
        localMappings,
        logIntercept: state.logIntercept,
        proxyServer,
      })
    proxyServer &&
      cliInterceptor.init({
        addInterceptorForBanner,
        logIntercept: state.logIntercept,
        getState: state.get,
        proxyServer,
        targetUrl: state.get().appUrls.cli,
      })
    addInterceptorForBanner({ proxyServer, domain })
    console.log(`🎭 ProxyPackInterceptorServer started on localhost:${port}`)
  })

// for debugging hoxy
proxyServer.log('error', function(event) {
  console.error(event.level + ': ' + event.message)
  if (event.error) console.error(event.error.stack)
})

module.exports = {
  updateWebpackOutputPath(_path) {
    state.set({ webpackOutputPath: _path })
  },
  init({
    browser = '',
    domain = '',
    externalMappings = {},
    localMappings = {},
    webpackMappings = [],
    withRpcServer = false,
  }) {
    const { isInit } = state.get()
    if (!isInit) {
      state.set({
        browser,
        domain,
        externalMappings,
        isInit: true,
        localMappings,
        webpackMappings,
      })
      withRpcServer &&
        rpcServer.init({
          onExternalMappingsChange: state.setExternalMappings,
        })
    }
  },
}
