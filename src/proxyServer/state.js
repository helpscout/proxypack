const fs = require('fs')
const path = require('path')

let state = {
  appUrls: {
    cli: 'http://localhost:7777/cli',
  },
  browser: 'chrome',
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

function getExternalResource(proxyUrl) {
  return state.externalResources[proxyUrl]
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
  updateExternalResource,
}
