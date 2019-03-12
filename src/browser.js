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
    .get('http://localhost:7777/info', { headers: { domain } })
    .then(response => {
      const info = response.data
      browser = browser || info.browser || 'chrome'
      domain = domain || info.domain
      //TODO add validation as some options break ProxyPack
      launchBrowser({ browser, domain })
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
