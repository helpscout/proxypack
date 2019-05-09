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
    getVirtualAssetURIsForWebpackEntry: state.getVirtualAssetURIsForWebpackEntry,
    proxyServer,
  })
}

function setOptions({ browser, domain: _domain }) {
  const { domain } = state.get()
  if (domain !== _domain) {
    state.setOptions({ browser, domain: _domain })
    // if the domain has changed, we need to add an interceptor for it
    addInterceptorForDomain({
      domain: _domain,
      proxyServer: state.getProxyServer()
    })
  } else {
    state.setOptions({ browser, domain })
  }
}

function addExternalMappingsInterceptor(proxyServer) {
  const { cachingRef, externalMappings } = state.get()
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
        domain,
        dynamicMappings,
        externalMappings,
        localMappings,
        webpackOutputPath,
        webpackMappings,
        useReplaceScriptBlockWithWebpackEntries
      } = state.get()

      addInterceptorForDomain({
        domain,
        proxyServer,
      })

      dynamicMappings && dynamicInterceptor.init({
        dynamicMappings,
        isFileNameWebpackEntry: state.isFileNameWebpackEntry,
        getVirtualAssetURIsForWebpackEntry: state.getVirtualAssetURIsForWebpackEntry,
        getLocalUriFromAssetsByChunkName: state.getLocalUriFromAssetsByChunkName,
        getWebpackEntryNameFromFileName: state.getWebpackEntryNameFromFileName,
        proxyServer,
      })

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
  state.setProxyServer(proxyServer)

  // for debugging hoxy
  // proxyServer.log('error', function (event) {
  //   console.error(event.level + ': ' + event.message)
  //   if (event.error) console.error(event.error.stack)
  // })
}

module.exports = {
  updateWebpackOutputPath(_path) {
    state.set({ webpackOutputPath: _path })
  },
  updateWebpackEntries(webpackEntries) {
    state.updateWebpackEntries(webpackEntries)
  },
  updateWebpackAssetsByChunkName(assetsByChunkName) {
    state.updateWebpackAssetsByChunkName(assetsByChunkName)
  },
  init({
    browser = '',
    domain = '',
    dynamicMappings = [],
    externalMappings = {},
    localDist = '',
    localMappings = {},
    webpackMappings = [],
    useReplaceScriptBlockWithWebpackEntries
  }) {
    const { isInit } = state.get()
    if (!isInit) {
      state.onReady(() => {
        state.set({
          browser,
          domain,
          dynamicMappings,
          externalMappings,
          isInit: true,
          localDist,
          localMappings,
          useReplaceScriptBlockWithWebpackEntries,
          webpackMappings,
        })
        initProxyServer()
        rpcServer.init({
          onExternalMappingsChange(externalMappings) {
            externalMappings && state.setExternalMappings(externalMappings)
            externalMappings && addExternalMappingsInterceptor(proxyServer)
          },
          onSetCachingRef: state.setCachingRef,
          onSetOptions: setOptions,
        })
      })
    }
  },
}
