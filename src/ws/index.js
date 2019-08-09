var WebSocketServer = require('websocket').server
var http = require('http')
const state = require('../proxyServer/state')

var connection
let unsentMessages = []
var server = http.createServer(function(request, response) {
  console.log(new Date() + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})
server.listen(1337, function() {
  console.log(new Date() + ' Server is listening on port 8080')
})

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
})

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject()
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.',
    )
    return
  }

  connection = request.accept('echo-protocol', request.origin)
  console.log(new Date() + ' Connection accepted.')

  for (message in unsentMessages) {
    connection.sendUTF(JSON.stringify(message))
  }
  unsentMessages = []

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const { method } = JSON.parse(message.utf8Data)

      if (method === 'getState') {
        connection.sendUTF(JSON.stringify(state.getDebugInfo()))
      }
    } else if (message.type === 'binary') {
      console.log(
        'Received Binary Message of ' + message.binaryData.length + ' bytes',
      )
      // connection.sendBytes(message.binaryData)
    }
  })
  connection.on('close', function(reasonCode, description) {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.',
    )
  })
})

function sendMessage(message) {
  if (connection) {
    connection.sendUTF(message)
  } else {
    unsentMessages.push(message)
  }
}

module.exports = {
  sendMessage,
}

console.log(wsServer)
