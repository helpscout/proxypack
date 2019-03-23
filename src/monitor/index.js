const wm = require('web-monitoring')

const options = {
  whileControl: (prevSource, nextSource) => prevSource === nextSource,
  lapse: 5000,
}

module.exports = function({ externalMappings, onExternalResourceChange }) {
  function addMonitor(proxyUrl) {
    wm.monitor(proxyUrl, options)
      .start()
      .on('alert', (url, source) => {
        onExternalResourceChange({ proxyUrl: url, source })
      })
  }
  Object.values(externalMappings).forEach(addMonitor)
}
