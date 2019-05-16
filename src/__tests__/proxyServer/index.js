const state = require('../../proxyServer/state')

jest.mock('../../rpcServer')

// const webpackOutputPath = '/Users/tjbo/sites/hsapp/site/js/dist/'

// const webpackMappings = [
//   'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist/*',
//   'https://dhmmnd775wlnp.cloudfront.net/*/js/apps/dist2/*',
// ]

// const localMappings = {
//   'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css': `${__dirname}/site/css/styles.css`,
// }

// const externalMappings = {
//   'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
//     'http://localhost:3001/static/js/main.2.1.js',
// }

// let proxyServer = require('../../proxyServer')

const domainInterceptor = require('../../proxyServer/interceptors/domain')
domainInterceptor.init = jest.fn()

const externalInterceptor = require('../../proxyServer/interceptors/external')
externalInterceptor.init = jest.fn()

const localInterceptor = require('../../proxyServer/interceptors/local')
localInterceptor.init = jest.fn()

const webpackInterceptor = require('../../proxyServer/interceptors/webpack')
webpackInterceptor.init = jest.fn()

describe('proxyServer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    state.set({ isInit: false })
    jest.resetModules()
  })

  it('should init proxyServer', () => {
    // proxyServer.init({
    //   browser: 'chrome',
    //   domain: 'http://www.helpscout.com',
    //   webpackMappings,
    //   localMappings,
    //   externalMappings,
    // })
    // const expectedState = state.get()
    // expect(expectedState.browser).toEqual('chrome')
    // expect(expectedState.domain).toEqual('http://www.helpscout.com')
  })

  it('should set a webpack path', () => {
    // proxyServer.init({
    //   browser: 'chrome',
    //   domain: 'http://www.helpscout.com',
    //   webpackMappings,
    //   localMappings,
    //   externalMappings,
    // })
    // state.set({ webpackOutputPath: '/some/path' })
    // const expectedState = state.get()
    // expect(expectedState.webpackOutputPath).toEqual('/some/path')
  })

  // it('should add interceptors', done => {
  //   proxyServer.init({
  //     browser: 'chrome',
  //     domain: 'http://www.helpscout.com',
  //     webpackMappings,
  //     localMappings,
  //     externalMappings,
  //   })

  //   state.set.({ webpackOutputPath })

  //   //next tick, something in hoxy doesnt' resolve completely in jest test
  //   setTimeout(() => {
  //     expect(domainInterceptor.init).toHaveBeenCalledTimes(1)
  //     expect(domainInterceptor.init).toHaveBeenCalledWith({
  //       domain: 'http://www.helpscout.com',
  //       proxyServer: expect.any(Object),
  //     })
  //     expect(externalInterceptor.init).toHaveBeenCalledTimes(1)
  //     expect(externalInterceptor.init).toHaveBeenCalledWith({
  //       externalMappings,
  //       proxyServer: expect.any(Object),
  //     })
  //     expect(localInterceptor.init).toHaveBeenCalledTimes(1)
  //     expect(localInterceptor.init).toHaveBeenCalledWith({
  //       localMappings,
  //       proxyServer: expect.any(Object),
  //     })
  //     expect(webpackInterceptor.init).toHaveBeenCalledTimes(1)
  //     expect(webpackInterceptor.init).toHaveBeenCalledWith({
  //       proxyServer: expect.any(Object),
  //       webpackMappings,
  //       webpackOutputPath,
  //     })
  //     done()
  //   }, 0)
  // })

  it('get state should be accurate', done => {
    // proxyServer.init({
    //   browser: 'chrome',
    //   domain: 'http://www.helpscout.com',
    //   localMappings: {},
    //   externalMappings: {},
    //   webpackMappings: [],
    // })
    // setTimeout(() => {
    //   expect(webpackInterceptor.init).toHaveBeenCalledTimes(0)
    //   expect(localInterceptor.init).toHaveBeenCalledTimes(0)
    //   expect(externalInterceptor.init).toHaveBeenCalledTimes(0)
    //   done()
    // }, 0)
  })

  // it('should init correctly', done => {
  //   proxyServer.init({})
  //   setTimeout(() => {
  //     const expectedState = state.get()
  //     expect(expectedState.browser).toEqual('')
  //     expect(expectedState.domain).toEqual('')
  //     expect(expectedState.webpackMappings).toEqual([])
  //     expect(expectedState.externalMappings).toEqual({})
  //     expect(expectedState.localMappings).toEqual({})
  //     done()
  //   })
  // })

  it('should init correctly', done => {
    // proxyServer.init({ browser: 'firefox' })
    // proxyServer.init({ browser: 'chrome' })
    // setTimeout(() => {
    //   const expectedState = state.get()
    //   expect(expectedState.browser).toEqual('firefox')
    //   done()
    // })
  })
})
