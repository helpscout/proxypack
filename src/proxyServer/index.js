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
  appUrls: {
    cli: 'http://localhost:7777/cli',
  },
  intercepts: [],
  isInit: false,
  port: 7777,
  webpackOutputPath: '',
}

function getState() {
  return state
}

function setState(newState) {
  state = { ...state, ...newState }
}

function logIntercept(intercept) {
  setState({ intercepts: [...state.intercepts, intercept] })
}

function addInterceptorForBanner(domain) {
  require('./interceptors/banner')({ proxyServer, domain })
}

function addInterceptors(proxyServer) {
  const {
    appUrls,
    domain,
    externalMappings,
    localMappings,
    webpackOutputPath,
    webpackMappings,
  } = getState()
  require('./interceptors/webpack')({
    logIntercept,
    proxyServer,
    webpackMappings,
    webpackOutputPath,
  })
  require('./interceptors/external')({ externalMappings, proxyServer })
  require('./interceptors/local')({ localMappings, logIntercept, proxyServer })
  require('./interceptors/cli')({
    addInterceptorForBanner,
    logIntercept,
    getState,
    proxyServer,
    targetUrl: appUrls.cli,
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
  updateWebpackOutputPath: function(_path) {
    setState({ webpackOutputPath: _path })
  },
  init({
    browser = '',
    domain = '',
    externalMappings = {},
    localMappings = {},
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
        webpackMappings,
      })
    }
  },
}
