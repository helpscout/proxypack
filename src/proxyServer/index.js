const hoxy = require('hoxy')
const fs = require('fs')
const path = require('path')

let state = {
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
  intercepts: [],
  isInit: false,
  port: 7777,
  webpackAssets: [],
}

function getState() {
  return state
}

function setState(newState) {
  state = { ...state, ...newState }
}

function getWebpackAsset(filename) {
  console.log('get', filename)
  return state.webpackAssets[filename]
}

function logIntercept(intercept) {
  setState({ intercepts: [...state.intercepts, intercept] })
}

function addInterceptorForBanner(domain) {
  require('./interceptors/banner')({ proxyServer, domain })
}

function addInterceptors(proxyServer) {
  const {
    domain,
    externalMappings,
    localMappings,
    webpackMappings,
  } = getState()
  require('./interceptors/webpack')({
    getWebpackAsset,
    proxyServer,
    webpackMappings,
  })
  require('./interceptors/external')({ externalMappings, proxyServer })
  require('./interceptors/local')({ localMappings, proxyServer })
  require('./interceptors/cli')({
    addInterceptorForBanner,
    getState,
    proxyServer,
  })
  addInterceptorForBanner(domain)
}

const port = getState().port

const proxyServer = hoxy
  .createServer({ certAuthority: state.certAuthority })
  .listen(port, status => {
    addInterceptors(proxyServer)
    console.log(`🎭 ProxyPack started on localhost: ${port}`)
  })

module.exports = {
  log: function() {},
  updateWebpackAssets: function(files) {
    setState({ webpackAssets: files })
  },
  init({
    browser = '',
    domain = '',
    externalMappings = {},
    localMappings = {},
    webpackAssets = {},
    webpackMappings = [],
  }) {
    const { isInit } = getState()
    if (!isInit) {
      setState({
        browser,
        domain,
        externalMappings,
        isInit: true,
        localMappings,
        webpackAssets,
        webpackMappings,
      })
    }
  },
}
