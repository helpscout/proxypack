const CONFIG = require('../constants/config')
const fs = require('fs')
const path = require('path')

let state = {
  browser: 'chrome',
  cachingRef: '',
  cert: {
    ca: {
      cert: fs.readFileSync(path.resolve(__dirname, CONFIG.SSL_CERTS.CA)),
      key: fs.readFileSync(path.resolve(__dirname, CONFIG.SSL_CERTS.CA_KEY)),
    },
    server: {
      cert: fs.readFileSync(path.resolve(__dirname, CONFIG.SSL_CERTS.SERVER)),
      key: fs.readFileSync(
        path.resolve(__dirname, CONFIG.SSL_CERTS.SERVER_KEY),
      ),
    },
  },
  domain: '',
  dynamicMappings: [],
  isLoggingEnabled: true,
  externalResources: {},
  isInit: false,
  port: 7777,
  webpackCompilerLocalOutputPath: '',
}

function get() {
  return state
}

function getDebugInfo() {
  // pluck off things with circular references
  const { cert, proxyServer, ...rest } = state
  console.log(rest)
  return rest
}

function set(newState) {
  state = { ...state, ...newState }
}

function setExternalMappings(externalMappings) {
  set({ externalMappings })
}

function setCachingRef({ ref }) {
  set({ cachingRef: ref })
}

function updateExternalResource(externalResource) {
  set({
    externalResources: { ...state.externalResources, ...externalResource },
  })
}

// virtualURIs are intercepted from the virutal domain
function getLocalAssetURIsForWebpackEntry(entryName) {
  return (
    state.webpackCompilerLocalOutputPath &&
    state.webpackEntries &&
    state.webpackEntries[entryName].assets
      .filter(filename => {
        // filter out source maps, since this is for inside browser
        return filename.split('.').pop() !== 'map'
      })
      .map(filename => {
        return CONFIG.LOCAL_WEBPACK_SERVER.URI + '/' + filename
      })
  )
}

// returns an array, right now only being used for dynamic imports
function getLocalUriFromAssetsByChunkName(entryName, isMap) {
  if (
    !state.webpackCompilerLocalOutputPath ||
    !state.assetsByChunkName ||
    !state.assetsByChunkName[entryName]
  ) {
    return []
  }

  // this needs some tweaking but works for now
  if (isMap) {
    return `${CONFIG.LOCAL_WEBPACK_SERVER.URI}/${
      state.assetsByChunkName[entryName][1]
    }`
  }
  return `${CONFIG.LOCAL_WEBPACK_SERVER.URI}/${
    state.assetsByChunkName[entryName][0]
  }`
}

module.exports = {
  get,
  getDebugInfo,
  getLocalUriFromAssetsByChunkName,
  getLocalAssetURIsForWebpackEntry,
  set,
  setCachingRef,
  setExternalMappings,
  updateExternalResource,
}
