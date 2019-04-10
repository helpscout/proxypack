const browser = require('../../browser')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
jest.mock('../../browser/openBrowser')
let openBrowser = require('../../browser/openBrowser')
let openBrowserSpy = jest.fn(() => {})
openBrowser.mockImplementation(openBrowserSpy)

const mockAdapter = new MockAdapter(axios)

describe('browser', () => {
  beforeEach(() => {
    openBrowserSpy = jest.fn(() => {})
    openBrowser.mockImplementation(openBrowserSpy)
  })

  afterEach(() => {
    mockAdapter.reset()
  })

  it('should open a browser to steveaoki.com in Firefox', () => {
    mockAdapter.onGet('http://localhost:7777/cli').reply(200, {
      browser: 'firefox',
      domain: 'http://www.steveaoki.com',
    })
    browser.initBrowser({ browser: '', domain: '' }).then(() => {
      expect(openBrowserSpy).toHaveBeenCalledTimes(1)
      expect(openBrowserSpy).toHaveBeenCalledWith({
        browser: 'firefox',
        domain: 'http://www.steveaoki.com',
      })
    })
  })

  it('should open a browser to steveaoki.com in Safari', () => {
    mockAdapter.onGet('http://localhost:7777/cli').reply(200, {})
    browser
      .initBrowser({ browser: 'safari', domain: 'http://www.steveaoki.com' })
      .then(() => {
        expect(openBrowserSpy).toHaveBeenCalledTimes(1)
        expect(openBrowserSpy).toHaveBeenCalledWith({
          browser: 'safari',
          domain: 'http://www.steveaoki.com',
        })
      })
  })

  it('should open a browser to steveaoki.com in Safari', () => {
    mockAdapter.onGet('http://localhost:7777/cli').reply(200, {})
    browser.initBrowser({ browser: '', domain: '' }).then(() => {
      expect(openBrowserSpy).toHaveBeenCalledTimes(1)
      expect(openBrowserSpy).toHaveBeenCalledWith({
        browser: 'chrome',
        domain: undefined,
      })
    })
  })

  it('should open a browser to steveaoki.com in Safari', () => {
    mockAdapter.onGet('http://localhost:7777/cli').reply(200, {})
    browser.initBrowser().then(() => {
      expect(openBrowserSpy).toHaveBeenCalledTimes(1)
      expect(openBrowserSpy).toHaveBeenCalledWith({
        browser: 'chrome',
        domain: undefined,
      })
    })
  })

  it('should open a browser with no domain', () => {
    mockAdapter.onGet('http://localhost:7777/cli').reply(200, {
      domain: '',
    })
    browser.initBrowser({ browser: '', domain: '' }).then(() => {
      expect(openBrowserSpy).toHaveBeenCalledTimes(1)
      expect(openBrowserSpy).toHaveBeenCalledWith({
        browser: 'chrome',
        domain: '',
      })
    })
  })

  it('should fail and log', () => {
    const logSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {})
    mockAdapter.onGet('http://localhost:7777/cli').reply()
    browser.initBrowser({ browser: '', domain: '' }).then(() => {
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        'ProxyPack failed to connect, is it running?',
      )
      expect(openBrowserSpy).toHaveBeenCalledTimes(0)
    })
  })
})
