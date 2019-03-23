const wm = require('web-monitoring')

/* istanbul ignore next */
const options = {
  whileControl: (prevSource, nextSource) => prevSource === nextSource,
  lapse: 5000,
}

module.exports = function({
  externalMappings,
  onExternalResourceChange,
  _wm = wm,
}) {
  function addMonitor(proxyUrl) {
    _wm
      .monitor(proxyUrl, options)
      .start()
      .on('alert', (url, source) => {
        onExternalResourceChange({ proxyUrl: url, source })
      })
      .on('error', error =>
        console.log('Web monitor failed to monitor an externalMapping', error),
      )
  }
  Object.values(externalMappings).forEach(addMonitor)
}
