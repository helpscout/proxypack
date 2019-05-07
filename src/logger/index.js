const state = require('../proxyServer/state')
const isEnabled = state.getIsLoggingEnabled()
const chalk = require('chalk')
const _log = console.log
const line = '--------------------------------------------------------------------------------'

const handleInterceptor = function({ type, proxyUrl, targetUrl }) {
    if (!isEnabled) return
    _log(chalk.blue(line))
    _log(chalk.blue(`${type}:handleInterceptor`))
    _log(chalk.blue(`targetUrl:${targetUrl}`))
    _log(chalk.blue(`proxyUrl:${proxyUrl}`))
}

const handleInterceptorError = function({ error, type, proxyUrl, targetUrl }) {
    if (!isEnabled) return
    _log(chalk.red(line))
    _log(chalk.red(`${type}:handleInterceptorError`))
    _log(chalk.red(`targetUrl:${targetUrl}`))
    _log(chalk.red(`proxyUrl:${proxyUrl}`))
    _log(chalk.red(`error:${error}`))
}

module.exports = {
   handleInterceptor,
   handleInterceptorError,
}
