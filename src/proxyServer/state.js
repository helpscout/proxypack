const fs = require('fs')
const path = require('path')
const branchName = require('branch-name')

let state = {
  branchName: '',
  browser: 'chrome',
  cachingRef: '',
  certAuthority: {
    key: fs.readFileSync(
      path.resolve(__dirname, '../assets/ssl/proxypack.key.pem'),
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, '../assets/ssl/proxypack.crt.pem'),
    ),
  },
  domain: '',
  localDist: '',
  isLoggingEnabled: true,
  externalResources: {},
  isInit: false,
  port: 7777,
  webpackOutputPath: '',
}

function get() {
  return state
}

function getIsLoggingEnabled() {
  return state.isLoggingEnabled
}

function set(newState) {
  state = { ...state, ...newState }
}

function setOptions({ browser, domain }) {
  set({ browser, domain })
}

function getExternalResource(proxyUrl) {
  return state.externalResources[proxyUrl]
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
    state.webpackOutputPath &&
    state.webpackEntries &&
    state.webpackEntries[entryName].assets
      .filter(filename => {
        // filter out source maps, since this is for inside browser
        return filename.split('.').pop() !== 'map'
      })
      .map(filename => {
        return state.localDist + filename
      })
  )
}

// returns an array, right now only being used for dynamic imports
function getLocalUriFromAssetsByChunkName(entryName, isMap) {
  if (
    !state.webpackOutputPath ||
    !state.assetsByChunkName ||
    !state.assetsByChunkName[entryName]
  ) {
    return []
  }

  // this needs some tweaking but works for now
  if (isMap) {
    // return []
    return state.webpackOutputPath + state.assetsByChunkName[entryName][1]
  }

  return state.webpackOutputPath + state.assetsByChunkName[entryName][0]
}

function updateWebpackEntries(webpackEntries) {
  set({
    webpackEntries,
  })
}

function updateWebpackAssetsByChunkName(assetsByChunkName) {
  set({
    assetsByChunkName,
  })
}

function setBranchName() {
  return branchName.get().then(name => {
    set({ branchName: name })
  })
}

function getBranchName() {
  return state.branchName
}

function getProxyServer() {
  return state.proxyServer
}

function setProxyServer(proxyServer) {
  set({ proxyServer })
}

module.exports = {
  get,
  getBranchName,
  getExternalResource,
  getIsLoggingEnabled,
  getLocalUriFromAssetsByChunkName,
  getProxyServer,
  getLocalAssetURIsForWebpackEntry,
  set,
  setBranchName,
  setCachingRef,
  setExternalMappings,
  setOptions,
  setProxyServer,
  updateExternalResource,
  updateWebpackAssetsByChunkName,
  updateWebpackEntries,
}
