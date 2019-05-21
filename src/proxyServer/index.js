const hoxy = require('hoxy')
const state = require('./state')
const domainInterceptor = require('./interceptors/domain')
const dynamicInterceptor = require('./interceptors/dynamic')
const externalInterceptor = require('./interceptors/external')
const localInterceptor = require('./interceptors/local')
const rpcServer = require('../rpcServer/index')
const webpackInterceptor = require('./interceptors/webpack')

function addInterceptorForDomain({ proxyServer, domain }) {
  domainInterceptor.init({
    domain,
    getLocalAssetURIsForWebpackEntry: state.getLocalAssetURIsForWebpackEntry,
    proxyServer,
  })
}

function setOptions({ browser, domain: _domain }) {
  const { domain, proxyServer } = state.get()
  if (domain !== _domain) {
    state.set({ browser, domain: _domain })
    // if the domain has changed, we need to add an interceptor for it
    addInterceptorForDomain({
      domain: _domain,
      proxyServer,
    })
  } else {
    state.set({ browser, domain })
  }
}

function addExternalMappingsInterceptor() {
  const { cachingRef, externalMappings, proxyServer } = state.get()
  externalInterceptor.init({
    cachingRef,
    externalMappings,
    proxyServer,
  })
}

function initProxyServer() {
  const { certAuthority, port } = state.get()

  const proxyServer = hoxy
    .createServer({ certAuthority })
    .listen(port, status => {
      // to do change these to getters
      const {
        externalMappings,
        localMappings,
        webpackOutputPath,
        webpackMappings,
      } = state.get()

      proxyServer._server.timeout = 1500000

      domainInterceptor.init()

      externalMappings && addExternalMappingsInterceptor(proxyServer)

      webpackMappings &&
        webpackInterceptor.init({
          proxyServer,
          webpackMappings,
          webpackOutputPath,
        })

      localMappings &&
        localInterceptor.init({
          localMappings,
          proxyServer,
        })

      console.log(`🎭 ProxyPackInterceptorServer started on localhost:${port}`)
    })
  state.set({ proxyServer })

  // for debugging hoxy
  proxyServer.log('error', function(event) {
    console.error(event.level + ': ' + event.message)
    if (event.error) console.error(event.error.stack)
  })
}

module.exports = {
  init({
    browser = '',
    domain = '',
    dynamicMappings = [],
    externalMappings = {},
    localDist = '',
    localMappings = {},
    localSSLDir,
    localWebpackServerURL,
    webpackMappings = [],
  }) {
    const { isInit } = state.get()
    if (!isInit) {
      state.set({
        browser,
        domain,
        dynamicMappings,
        externalMappings,
        isInit: true,
        localDist,
        localMappings,
        localSSLDir,
        localWebpackServerURL,
        webpackMappings,
      })
      initProxyServer()
      rpcServer.init({
        onExternalMappingsChange(externalMappings) {
          externalMappings && state.setExternalMappings(externalMappings)
          externalMappings && addExternalMappingsInterceptor()
        },
        onSetCachingRef: state.setCachingRef,
        onSetOptions: setOptions,
      })
    }
  },
}
