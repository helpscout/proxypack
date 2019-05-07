const fs = require('fs')
const path = require('path')
const state = require('../../proxyServer/state')

let _state = {
  browser: 'chrome',
  cachingRef: '12345678',
  certAuthority: {
    key: fs.readFileSync(
      path.resolve(__dirname, '../../assets/ssl/proxypack.key.pem'),
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, '../../assets/ssl/proxypack.crt.pem'),
    ),
  },
  domain: '',
  externalResources: {},
  intercepts: [],
  isInit: false,
  port: 7777,
  webpackOutputPath: '',
}

describe('state', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    state.set(_state)
  })

  it('should match initial state', () => {
    expect(state.get()).toEqual(_state)
  })

  it('should updateExternalResource', () => {
    let newResource = {
      'http://localhost:3001/static/js/main.2.1.js': 'source code',
    }
    state.updateExternalResource(newResource)
    expect(state.get()).toEqual({ ..._state, externalResources: newResource })
    newResource = {
      'http://localhost:3001/static/js/main.2.1.js': 'changed source code',
    }
    state.updateExternalResource(newResource)
    expect(state.get()).toEqual({ ..._state, externalResources: newResource })
  })

  it('should getExternalResource', () => {
    let newResource = {
      'http://localhost:3001/static/js/main.2.1.js': 'source code',
    }
    state.updateExternalResource(newResource)
    expect(state.getExternalResource(Object.keys(newResource)[0])).toEqual(
      'source code',
    )
  })

  it('should log an intercept', () => {
    let intercept = {
      statusCode: 200,
      targetUrl: 'http://localhost:3001/static/js/main.2.1.js',
      proxyUrl: 'http://www.someotherserver.com/static/js/main.2.1.js',
    }
    expect(state.get()).toEqual({ ..._state, intercepts: [intercept] })
  })
})
