const fs = require('fs')
const path = require('path')

let state = {
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
  externalResources: {},
  intercepts: [],
  isInit: false,
  port: 7777,
  webpackOutputPath: '',
}

function get() {
  return state
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

function logIntercept(intercept) {
  set({
    intercepts: [...state.intercepts, intercept],
  })
}

function updateExternalResource(externalResource) {
  set({
    externalResources: { ...state.externalResources, ...externalResource },
  })
}

module.exports = {
  getExternalResource,
  get,
  logIntercept,
  set,
  setCachingRef,
  setExternalMappings,
  setOptions,
  updateExternalResource,
}
