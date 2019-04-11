const rpcServer = require('../src/rpcServer')

rpcServer.init({
  onExternalMappingsChange: function(externalMappings) {
    console.log(externalMappings)
  },
})
