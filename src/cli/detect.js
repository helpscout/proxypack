var launcher = require('@james-proxy/james-browser-launcher')

launcher.detect(function(available) {
  console.log('Available browsers:')
  console.dir(available)
})
