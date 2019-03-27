const fs = require('fs')
const path = require('path')
const browser = 'firefox'
const domain = 'https://secure.helpscout.net'
const webpackMappings = [
  'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
  'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
]

const localMappings = {
  'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
}

const externalMappings = {
  'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
    'http://localhost:3001/static/js/main.2.1.js',
}

const webpackOutputPath = '/Users/tjbo/sites/hsapp/site/js/dist/'

let proxyServer = require('../../proxyServer')

// const _proxyServer = jest.mock('hoxy', () => {
//     return {
//         createServer: function () {
//             return this
//         },
//         listen: function(port, callback) {
//             callback(_proxyServer)
//             return this
//         }
//     }
// })

const bannerInterceptor = require('../../proxyServer/interceptors/banner')
bannerInterceptor.init = jest.fn()

const cliInterceptor = require('../../proxyServer/interceptors/cli')
cliInterceptor.init = jest.fn()

const externalInterceptor = require('../../proxyServer/interceptors/external')
externalInterceptor.init = jest.fn()

const localInterceptor = require('../../proxyServer/interceptors/local')
localInterceptor.init = jest.fn()

const webpackInterceptor = require('../../proxyServer/interceptors/webpack')
webpackInterceptor.init = jest.fn()

describe('proxyServer', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  // it('should init proxyServer', () => {
  //     proxyServer.init({
  //         browser,
  //         domain,
  //         webpackMappings,
  //         localMappings,
  //         externalMappings
  //       })

  //     const state = proxyServer.get()
  //     expect(state.browser).toEqual(browser)
  //     expect(state.domain).toEqual(domain)
  // })

  // it('should set a webpack path', () => {
  //     proxyServer.updateWebpackOutputPath('/some/path')
  //     const state = proxyServer.get()
  //     expect(state.webpackOutputPath).toEqual('/some/path')
  // })

  it('should call a require', () => {
    proxyServer.init({
      browser,
      domain,
      webpackMappings,
      localMappings,
      externalMappings,
    })

    proxyServer.updateWebpackOutputPath(webpackOutputPath)

    // next tick, something in hoxy doesnt' resolve completely in jest test
    setTimeout(() => {
      // expect(bannerInterceptor.init).toHaveBeenCalledTimes(1)
      // expect(bannerInterceptor.init).toHaveBeenCalledWith({
      //     domain,
      //     proxyServer: expect.any(Object),
      // })
      // expect(cliInterceptor.init).toHaveBeenCalledTimes(1)
      // expect(cliInterceptor.init).toHaveBeenCalledWith({
      //     addInterceptForBanner: expect.any(Function),
      //     logIntercept: expect.any(Function),
      //     getState: expect.any(Object),
      //     proxyServer: expect.any(Object),
      //     targetUrls:  expect.any(Object)
      // })
      expect(externalInterceptor.init).toHaveBeenCalledTimes(1)
      expect(externalInterceptor.init).toHaveBeenCalledWith({
        externalMappings,
        getExternalResource: expect.any(Function),
        logIntercept: expect.any(Function),
        proxyServer: expect.any(Object),
      })
      expect(localInterceptor.init).toHaveBeenCalledTimes(1)
      expect(localInterceptor.init).toHaveBeenCalledWith({
        localMappings,
        logIntercept: expect.any(Function),
        proxyServer: expect.any(Object),
      })
      expect(webpackInterceptor.init).toHaveBeenCalledTimes(1)
      expect(webpackInterceptor.init).toHaveBeenCalledWith({
        logIntercept: expect.any(Function),
        proxyServer: expect.any(Object),
        webpackMappings,
        webpackOutputPath,
      })
    }, 0)
  })

  it('get state should be accurate', () => {
    // proxyServer.init({
    //     browser,
    //     domain,
    //     localMappings,
    //     externalMappings
    // })
    // setTimeout(() => {
    //     expect(webpackInterceptor.init).toHaveBeenCalledTimes(0)
    // }, 0)
  })
})
