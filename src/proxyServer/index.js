const hoxy = require('hoxy')
const state = require('./state')
const domainInterceptor = require('./interceptors/domain')
const externalInterceptor = require('./interceptors/external')
const localInterceptor = require('./interceptors/local')
const rpcServer = require('../rpcServer/index')

function addInterceptorForDomain({ proxyServer, domain }) {
  domainInterceptor.init({
    domain,
    proxyServer,
  })
}

function onDomainChange(domain) {
  state.set({ domain })
  const { proxyServer } = state.get()
  addInterceptorForDomain({
    domain,
    proxyServer,
  })
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
  const { cert, port } = state.get()

  const proxyServer = hoxy
    .createServer({ certAuthority: cert.ca })
    .listen(port, status => {
      // to do change these to getters
      const { externalMappings, localMappings, webpackMappings } = state.get()

      proxyServer._server.timeout = 15000000

      domainInterceptor.init()

      externalMappings && addExternalMappingsInterceptor(proxyServer)

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
    externalMappings = {},
    localDist = '',
    localMappings = {},
    webpackMappings = [],
  }) {
    const { isInit } = state.get()
    if (!isInit) {
      state.set({
        browser,
        domain,
        externalMappings,
        isInit: true,
        localDist,
        localMappings,
        webpackMappings,
      })
      initProxyServer()
      rpcServer.init({
        onExternalMappingsChange(externalMappings) {
          externalMappings && state.setExternalMappings(externalMappings)
          externalMappings && addExternalMappingsInterceptor()
        },
        onSetCachingRef: state.setCachingRef,
        onDomainChange: onDomainChange,
      })
    }
  },
}
