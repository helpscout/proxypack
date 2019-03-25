const program = require('safe-commander')
program.optsObj = {
  browser: 'firefox',
  domain: 'https://secure.helpscout.net',
}

const browser = require('../../browser')
browser.initBrowser = jest.fn(() => {})

describe('cli', () => {
  it('should call program', () => {
    require('../../cli')
    expect(browser.initBrowser).toBeCalledTimes(1)
    expect(browser.initBrowser).toBeCalledWith({
      browser: 'firefox',
      domain: 'https://secure.helpscout.net',
    })
  })
})
