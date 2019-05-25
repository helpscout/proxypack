const launcher = require('@james-proxy/james-browser-launcher')

function openBrowser({ browser, domain }) {
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
        options: [
          '--disable-web-security',
          '--disable-extensions',
          '--ignore-certificate-errors',
        ],
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
          console.log('Instance stopped with exit code:', code)
        })
      },
    )
  })
}

module.exports = openBrowser
