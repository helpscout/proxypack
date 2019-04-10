const openBrowser = require('../../browser/openBrowser')
jest.mock('@james-proxy/james-browser-launcher')

const browser = 'firefox'
const domain = 'https://www.steveaoki.com'
const launcher = require('@james-proxy/james-browser-launcher')

const options = {
  browser,
  detached: true,
  options: [
    '--disable-web-security',
    '--disable-extensions',
    '--ignore-certificate-errors',
  ],
  proxy: 'localhost:7777',
}

const instanceUnrefSpy = jest.fn(() => {})
const instanceOnCallbackSpy = jest.fn()
let simulateInstanceOnCallback = null
const instanceOnSpy = jest.fn((value, callback) => {
  simulateInstanceOnCallback = callback
})

function makeLaunchSpy(error) {
  return jest.fn((domain, options, callback) => {
    const instanceSpy = {
      process: {
        unref: instanceUnrefSpy,
        stdin: {
          unref: instanceUnrefSpy,
        },
        stdout: {
          unref: instanceUnrefSpy,
        },
        stderr: {
          unref: instanceUnrefSpy,
        },
      },
      on: () => instanceOnSpy(null, instanceOnCallbackSpy),
    }
    callback(error, instanceSpy)
  })
}

let launchSpy = makeLaunchSpy()

const errorSpy = jest.spyOn(global.console, 'error')
const logSpy = jest.spyOn(global.console, 'log')

describe('openBrowser', () => {
  beforeEach(() => {
    errorSpy.mockClear()
    instanceOnSpy.mockClear()
    instanceUnrefSpy.mockClear()
    instanceOnCallbackSpy.mockClear()
    logSpy.mockClear()
  })

  it('should not open a browser', () => {
    launcher.mockImplementation(function(callback) {
      const error = new Error('test error1')
      callback(error, launchSpy)
    })
    openBrowser({ browser: '', domain: '' })
    expect(launchSpy).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('should open a browser', () => {
    launcher.mockImplementation(function(callback) {
      callback(null, launchSpy)
    })
    openBrowser({ browser: 'firefox', domain })
    expect(launchSpy).toHaveBeenCalledTimes(1)
    expect(launchSpy).toHaveBeenCalledWith(
      domain,
      options,
      expect.any(Function),
    )
  })

  it('should detach the instance', () => {
    launcher.mockImplementation(function(callback) {
      callback(null, launchSpy)
    })
    openBrowser({ browser: 'firefox', domain })
    expect(instanceOnSpy).toHaveBeenCalledTimes(1)
    expect(instanceUnrefSpy).toHaveBeenCalledTimes(4)
    expect(instanceOnCallbackSpy).toHaveBeenCalledTimes(0)
  })

  it('should call instance callback on stop', () => {
    launcher.mockImplementation(function(callback) {
      callback(null, launchSpy)
    })
    simulateInstanceOnCallback.call()
    expect(instanceOnCallbackSpy).toHaveBeenCalledTimes(1)
    instanceOnCallbackSpy()
    // expect(instanceOnCallbackSpy).toHaveBeenCalledWith(undefined)
    // expect(logSpy).toHaveBeenCalledWith('Instance stopped with exit code:', 666)
  })

  it('should throw an error', () => {
    launcher.mockImplementation(function(callback) {
      launchSpy = makeLaunchSpy('test error2')
      callback(null, launchSpy)
    })
    openBrowser({ browser: 'firefox', domain })
    expect(instanceOnSpy).toHaveBeenCalledTimes(0)
    expect(instanceUnrefSpy).toHaveBeenCalledTimes(0)
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith('test error2')
    expect(launchSpy).toHaveReturned(undefined)
  })
})
