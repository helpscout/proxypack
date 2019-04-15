const hoxy = require('hoxy')
const bannerInterceptor = require('./interceptors/banner')
const externalInterceptor = require('./interceptors/external')
const localInterceptor = require('./interceptors/local')
const rpcServer = require('../rpcServer/index')
const webpackInterceptor = require('./interceptors/webpack')
const state = require('./state')
const { certAuthority, port } = state.get()

function addInterceptorForBanner({ proxyServer, domain }) {
  bannerInterceptor.init({ proxyServer, domain })
}

function setOptions({ browser, domain: _domain }) {
  const { domain } = state.get()
  if (domain !== _domain) {
    state.setOptions({ browser, domain: _domain })
    addInterceptorForBanner({ domain: _domain, proxyServer })
  } else {
    state.setOptions({ browser, domain })
  }
}

function addExternalMappingsInterceptor(proxyServer) {
  const { cachingRef, externalMappings } = state.get()
  externalInterceptor.init({
    cachingRef,
    externalMappings,
    logIntercept: state.logIntercept,
    proxyServer,
  })
}

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
    externalMappings && addExternalMappingsInterceptor(proxyServer)
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
    addInterceptorForBanner({ proxyServer, domain })
    console.log(`🎭 ProxyPackInterceptorServer started on localhost:${port}`)
  })

// for debugging hoxy
// proxyServer.log('error', function (event) {
//   console.error(event.level + ': ' + event.message)
//   if (event.error) console.error(event.error.stack)
// })

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
          onExternalMappingsChange(externalMappings) {
            state.setExternalMappings(externalMappings)
            addExternalMappingsInterceptor(proxyServer)
          },
          onSetCachingRef: state.setCachingRef,
          onSetOptions: setOptions,
        })
    }
  },
}
