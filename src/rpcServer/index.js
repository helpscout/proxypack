const http = require('http')
const url = require('url')
const openBrowser = require('../browser/openBrowser')
const state = require('../proxyServer/state')

function init({ onSetCachingRef, onExternalMappingsChange, onDomainChange }) {
  const server = http.createServer(requestListener)
  const PORT = 17777
  console.log(`🎭 ProxyPackRPCServer started on localhost:${PORT}`)

  const methods = {
    setExternalMappings: {
      exec(externalMappings) {
        return new Promise(resolve => {
          onExternalMappingsChange(externalMappings)
          resolve(externalMappings)
        })
      },
    },
    openBrowser: {
      exec() {
        return new Promise(resolve => {
          const { browser, domain } = state.get()
          openBrowser({ browser, domain })
          resolve({
            openBrowser: 'success',
          })
        })
      },
    },
    setOptions: {
      exec({ browser = 'chrome', domain }) {
        return new Promise(resolve => {
          if (browser) {
            state.set({ browser })
          }

          if (domain) {
            onDomainChange(domain)
          }

          resolve({
            browser,
            domain,
          })
        })
      },
    },
    setCachingRef: {
      exec(ref) {
        return new Promise(resolve => {
          onSetCachingRef(ref)
          resolve(ref)
        })
      },
    },
  }

  let routes = {
    // this is the rpc endpoint
    // every operation request will come through here
    '/rpc': function(body) {
      return new Promise((resolve, reject) => {
        if (!body) {
          throw new `rpc request was expecting some data...!`()
        }
        let _json = JSON.parse(body) // might throw error
        let keys = Object.keys(_json)
        let promiseArr = []

        for (let key of keys) {
          if (methods[key] && typeof methods[key].exec === 'function') {
            let execPromise = methods[key].exec.call(null, _json[key])
            if (!(execPromise instanceof Promise)) {
              throw new Error(
                `ProxyPack, RPCError, Exec on ${key} did not return a promise`,
              )
            }
            promiseArr.push(execPromise)
          } else {
            let execPromise = Promise.resolve({
              error: 'ProxyPack, RPCError method not defined',
            })
            promiseArr.push(execPromise)
          }
        }

        Promise.all(promiseArr)
          .then(iter => {
            let response = {}
            iter.forEach((val, index) => {
              response[keys[index]] = val
            })

            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  }

  function requestListener(request, response) {
    let reqUrl = `http://${request.headers.host}${request.url}`
    let parseUrl = url.parse(reqUrl, true)
    let pathname = parseUrl.pathname

    // we're doing everything json
    response.setHeader('Content-Type', 'application/json')

    // avoid CORS errors
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE, OPTIONS',
    )
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, application/json, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method, Cache-Control, Connection',
    )
    response.setHeader('Access-Control-Allow-Credentials', true)

    if (request.method === 'OPTIONS') {
      response.end()
      return
    }

    // buffer for incoming data
    let buf = null

    // listen for incoming data
    request.on('data', data => {
      if (buf === null) {
        buf = data
      } else {
        buf = buf + data
      }
    })

    // on end proceed with compute
    request.on('end', () => {
      let body = buf !== null ? buf.toString() : null

      if (routes[pathname]) {
        let compute = routes[pathname].call(null, body)

        if (!(compute instanceof Promise)) {
          // we're kinda expecting compute to be a promise
          // so if it isn't, just avoid it

          response.statusCode = 500
          response.end('ProxyPack, RPCError, oops! server error!')
          console.warn(
            `ProxyPack, RPCError, whatever I got from rpc wasn't a Promise!`,
          )
        } else {
          compute
            .then(res => {
              response.end(JSON.stringify(res))
            })
            .catch(err => {
              console.error(err)
              response.statusCode = 500
              response.end('ProxyPack, RPCError, oops! server error!')
            })
        }
      } else {
        response.statusCode = 404
        response.end(`ProxyPack, RPCError, oops! ${pathname} not found here`)
      }
    })
  }

  // now we can start up the server
  server.listen(PORT)
}

module.exports = {
  init,
}
