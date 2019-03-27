const webMonitor = require('../../monitor')

const externalMappings = {
  'https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js':
    'http://localhost:3001/static/js/main.2.1.js',
}

const proxyUrl = Object.values(externalMappings)[0]
const source = 'some source code'
const onExternalResourceChangeSpy = jest.fn()

const _wm = {
  monitor: function() {
    return this
  },
  simulate: function(message, ...rest) {
    this.simulatedCallbacks[message](...rest)
  },
  simulatedCallbacks: {},
  monitor: function() {
    return this
  },
  start: function() {
    return this
  },
  on: function(message, callback) {
    this.simulatedCallbacks[message] = callback
    return this
  },
}

describe('monitor', () => {
  it('should call onExternalResourceChange', () => {
    webMonitor.init({
      externalMappings,
      onExternalResourceChange: onExternalResourceChangeSpy,
      _wm,
    })
    _wm.simulate('alert', proxyUrl, source)
    expect(onExternalResourceChangeSpy).toBeCalledTimes(1)
    expect(onExternalResourceChangeSpy).toBeCalledWith({ proxyUrl, source })
  })
  it('should call console.log', () => {
    const log = jest.spyOn(global.console, 'log').mockImplementation(() => {})
    webMonitor.init({
      externalMappings,
      onExternalResourceChange: onExternalResourceChangeSpy,
      _wm,
    })
    _wm.simulate('error', proxyUrl, source)
    expect(log).toBeCalledTimes(1)
    expect(log).toBeCalledWith(
      'Web monitor failed to monitor an externalMapping',
      proxyUrl,
    )
  })
})
