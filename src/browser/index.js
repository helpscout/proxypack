const launcher = require('@james-proxy/james-browser-launcher')
const axios = require('axios')

function launchBrowser({ browser, domain }) {
  launcher(function(err, launch) {
    if (err) {
      return console.error(err)
    }
    launch(
      domain || info.domain,
      {
        proxy: 'localhost:7777',
        browser: browser,
        detached: true,
        options: [
          '--disable-web-security',
          '--disable-extensions',
          '--ignore-certificate-errors',
        ],
      },
      function(err, instance) {
        console.log(
          `🎭 ProxyPack instance started for ${domain} in ${browser}.`,
        )

        if (err) {
          return console.error(err)
        }

        instance.process.unref()
        instance.process.stdin.unref()
        instance.process.stdout.unref()
        instance.process.stderr.unref()

        instance.on('stop', function(code) {
          console.log('Instance stopped with exit code:', code)
        })
      },
    )
  })
}

function openBrowser({ browser = '', domain = '' }) {
  axios
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
      launchBrowser({ browser: _browser, domain: _domain })
    })
    .catch(error => {
      if (error.code === 'ECONNREFUSED') {
        console.log('ProxyPack failed to connect, is it running?')
      } else {
        console.log(error)
      }
    })
}

module.exports = openBrowser
