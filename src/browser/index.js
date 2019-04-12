const axios = require('axios')
const openBrowser = require('./openBrowser')

function initBrowser({ browser = '', domain = '' } = {}) {
  openBrowser({ domain, browser })
}

module.exports = {
  initBrowser,
}
