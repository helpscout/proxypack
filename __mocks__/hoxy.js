'use strict'

const hoxy = require('hoxy')

// function CreateServer(options) {
//     return this
// }

// CreateServer.prototype.listen = (this) => {
// }

// CreateServer.prototype.intercept = function({
//     phase, fullUrl, as
// }, callback) {
//     return {

//     }
// }

// const createServer = CreateServer
// hoxy.createServer = new CreateServer()

function createServer() {
  return {
    listen: function() {
      return this
    },
    intercept: function() {
      return this
    },
    close: function() {
      return this
    }
  }
}

hoxy.createServer = createServer

module.exports = hoxy
