const launcher = require('@james-proxy/james-browser-launcher')
const openFirefox = require('./firefox')
const safari = require('./safari')

function openBrowser({ browser, domain }) {
  if (browser === 'safari') {
    safari.setupSafariProxy()
  }

  if (browser === 'firefox') {
    openFirefox(domain)
  } else {
    launcher(function(error, launch) {
      if (error) {
        console.error(error)
        return
      }
      launch(
        domain,
        {
          proxy: 'localhost:7777',
          browser: browser,
          detached: true,
          options: ['--disable-web-security', '--ignore-certificate-errors'],
        },
        function(error, instance) {
          if (error) {
            console.error(error)
            return
          }
          console.log(
            `🎭 ProxyPack browser instance started for ${domain} in ${browser}.`,
          )
          // instance.process.unref()
          // instance.process.stdin.unref()
          // instance.process.stdout.unref()
          // instance.process.stderr.unref()
          instance.on('stop', function(code) {
            if (browser === 'safari') {
              safari.teardownSafariProxy()
            }
            console.log('Instance stopped with exit code:', code)
          })
        },
      )
    })
  }
}

module.exports = openBrowser
