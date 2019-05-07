const axios = require('axios')

function setOptions({ browser, domain }) {
  if (browser || domain) {
    return axios({
      method: 'post',
      url: 'http://localhost:17777/rpc',
      data: {
        setOptions: {
          browser,
          domain
        }
      }
    })
  } else {
    return Promise.resolve()
  }
}

function openBrowser() {
  return axios({
    method: 'post',
    url: 'http://localhost:17777/rpc',
    data: {
      openBrowser: true
    }
  })
}

function initBrowser({ browser = '', domain = '' } = {}) {
  setOptions({ browser, domain })
  .then(() => openBrowser())
  .catch(() => console.log('Browser failed to open. Is ProxyPack running?'))
}

module.exports = {
  initBrowser,
}
