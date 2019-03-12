const axios = require('axios')
const fs = require('fs')
const path = require('path')
const hoxy = require('hoxy')
const keyFile = path.resolve(__dirname, 'proxypack.key.pem')
const certFile = path.resolve(__dirname, 'proxypack.crt.pem')

class ProxyServer {
  constructor({
    browser = '',
    domain = '',
    externalMappings = {},
    mappings = {},
  } = {}) {
    this.browser = browser
    this.domain = domain
    this.externalMappings = externalMappings
    this.options = {}
    this.port = 7777
    this.webpackAssets = {}
    this.mappings = mappings

    try {
      // get SSL cert from local file dir
      const key = fs.readFileSync(keyFile)
      const cert = fs.readFileSync(certFile)
      this.options.certAuthority = { key, cert }
    } catch (error) {
      const [reason] = error.message.split('\n')
    }

    this.proxyServer = hoxy
      .createServer(this.options)
      .listen(this.port, status => {
        console.log('🎭 ProxyPack started on localhost:' + this.port + '\n')
      })

    this.proxyServer.on('error', error => {
      // console.log("error", error);
    })

    this.externalMappings &&
      Object.keys(this.externalMappings).forEach(
        this.addInterceptForExternalMapping.bind(this),
      )

    this.mappings.length &&
      this.mappings.forEach(this.addInterceptForMapping.bind(this))
    this.domain && this.addInterceptForBanner.apply(this)
    this.addInterceptForInfo.apply(this)
  }

  addInterceptForInfo() {
    this.proxyServer.intercept(
      {
        phase: 'request',
        fullUrl: 'http://localhost:' + this.port + '/info',
        as: 'string',
      },
      (req, resp) => {
        // if there is a domain in this header, use that instead to match against on the intercept
        const domainInHeader = req.headers && req.headers['domain']
        if (domainInHeader && this.domain !== domainInHeader) {
          this.domain = domainInHeader
          this.domain && this.addInterceptForBanner()
        }
        if (req.url === '/info') {
          const data = {
            browser: this.browser,
            domain: this.domain,
            mappings: this.mappings,
          }
          resp.statusCode = 200
          resp.string = JSON.stringify(data)
        }
      },
    )
  }

  addInterceptForBanner() {
    this.proxyServer.intercept(
      {
        contentType: 'text/html; charset=UTF-8',
        phase: 'response',
        fullUrl: this.domain + '/*',
        as: '$',
      },
      (req, resp, cycle) => {
        resp
          .$('body')
          .prepend(
            '<div style="display: block; text-align: center; padding: 7px; width: 100%; background-color: #E89635; color: #fff; border-top: 1px solid #fff;">🎭 This web browser is currently connected to ProxyPack.</div>',
          )
      },
    )
  }

  addInterceptForExternalMapping(mapping) {
    this.proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: mapping,
      },
      (req, resp, cycle) => {
        // it seems like returning axios directly doesn't work, which is why there is an extra wrapping here
        // may want to tweak this in the future
        return new Promise((resolve, reject) => {
          return axios
            .get(this.externalMappings[mapping], { responseType: 'text' })
            .then(function(response) {
              resp.statusCode = 200
              resp.string = response.data
              resolve()
            })
            .catch(function(error) {
              console.log(error)
              reject()
            })
        })
      },
    )
  }

  addInterceptForMapping(mapping) {
    this.proxyServer.intercept(
      {
        phase: 'request',
        method: 'GET',
        as: 'string',
        fullUrl: mapping,
      },
      (req, resp, cycle) => {
        const filename = path.parse(req.url).base
        const webpackFile = this.webpackAssets[filename]
        if (webpackFile) {
          resp.statusCode = 203
          // hoxy will immediately return the response once the string is written
          resp.string = webpackFile
        }
      },
    )
  }

  updateWebpackAssets(files) {
    this.webpackAssets = files
  }
}

module.exports = ProxyServer
