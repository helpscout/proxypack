const axios = require('axios')
const openBrowser = require('./openBrowser')

function initBrowser({ browser = '', domain = '' } = {}) {
  // queries the running proxy pack instance
  return axios
    .get('http://localhost:7777/cli', { headers: { domain } })
    .then(response => {
      const {
        browser: browserFromServer,
        domain: domainFromServer,
      } = response.data
      // if we don't have a browser passed in via CLI it gets the value from the proxyServer
      const _browser = browser || browserFromServer || 'chrome'
      const _domain = domain || domainFromServer
      // TODO add validation as some options break ProxyPack
      openBrowser({ domain: _domain, browser: _browser })
    })
    .catch(error => {
      console.log('ProxyPack failed to connect, is it running?')
    })
}

module.exports = initBrowser
