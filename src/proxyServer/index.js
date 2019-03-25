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
  externalResources: {},
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

function getExternalResource(proxyUrl) {
  return state.externalResources[proxyUrl]
}

function logIntercept(intercept) {
  setState({ intercepts: [...state.intercepts, intercept] })
}

function updateExternalResource(externalResource) {
  setState({
    externalResources: { ...state.externalResources, ...externalResource },
  })
}

function addInterceptorForBanner(domain) {
  require('./interceptors/banner')({ proxyServer, domain })
}

function onExternalResourceChange({ proxyUrl, source }) {
  updateExternalResource({ [proxyUrl]: source })
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
  externalMappings &&
    require('../monitor')({ externalMappings, onExternalResourceChange })
  externalMappings &&
    require('./interceptors/external')({
      externalMappings,
      getExternalResource,
      logIntercept,
      proxyServer,
    })
  webpackMappings &&
    require('./interceptors/webpack')({
      logIntercept,
      proxyServer,
      webpackMappings,
      webpackOutputPath,
    })
  localMappings &&
    require('./interceptors/local')({
      localMappings,
      logIntercept,
      proxyServer,
    })
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

// for debugging hoxy
// proxyServer.log('error warn debug', function(event) {
//   console.error(event.level + ': ' + event.message);
//   if (event.error) console.error(event.error.stack);
// });

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
