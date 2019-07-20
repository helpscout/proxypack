const code = `
  // if user is running mozilla then use it's built-in WebSocket
  (function() {
  window.WebSocket = window.WebSocket || window.MozWebSocket

  var connection = new WebSocket('wss://proxypack.local.sumoci.net:1337')

  connection.onopen = function() {
      console.log('Connected to ProxyPack')
    // connection is opened and ready to use
  }

  connection.onerror = function(error) {
    // an error occurred when sending/receiving data
  }

  connection.onmessage = function(message) {
    // try to decode json (I assume that each message
    // from server is json)
    try {
      var json = JSON.parse(message.data)
    } catch (e) {
      console.log("This doesn't look like a valid JSON: ", message.data)
      return
    }
    // handle incoming message
  }
})()
`

module.exports = code
