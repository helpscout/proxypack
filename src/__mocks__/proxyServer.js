const proxyServer = {
  simulatedCallbacks: [],
  simulate: function(request, response, cycle, targetUrl) {
    const simulatedCallback = this.simulatedCallbacks.find(
      simulatedCallback => {
        return targetUrl === simulatedCallback[0]
      },
    )
    simulatedCallback[1](request, response, cycle)
  },
  intercept: jest.fn(function(obj, callback) {
    this.simulatedCallbacks.push([obj.fullUrl, callback])
  }),
}

module.exports = proxyServer
