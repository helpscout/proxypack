#!/usr/bin/env node
var WebSocketClient = require('websocket').client
var client = new WebSocketClient()

let connection

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString())
})

client.on('connect', function(connection) {
  connection.sendUTF(JSON.stringify({ method: 'getState' }))

  console.log('WebSocket Client Connected')
  connection.on('error', function(error) {
    console.log('Connection Error: ' + error.toString())
  })
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed')
  })
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('incoming -> ' + JSON.parse(message.utf8Data))
    }
  })
})

// function sendNumber() {
//   if (connection.connected) {
//     var number = Math.round(Math.random() * 0xffffff)
//     connection.sendUTF(number.toString())
//     setTimeout(sendNumber, 1000)
//   }
// }
// setTimeout(sendNumber, 1999)

client.connect('ws://localhost:1337/', 'echo-protocol')
