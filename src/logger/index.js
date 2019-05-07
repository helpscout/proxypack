const state = require('../proxyServer/state')
const isEnabled = state.getIsLoggingEnabled()
const chalk = require('chalk')
const _log = console.log
const line = '-----------------------------------------------------------------------------'

let count = 0

function startLine() {
    count++
    return `[${count}] ${line}`
}

const handleInterceptor = function({ type, proxyUrl, targetUrl, message }) {
    if (!isEnabled) return
    _log(chalk.green(startLine()))
    _log(chalk.green(`${type}:handleInterceptor`))
    _log(chalk.green(`targetUrl:${targetUrl}`))
    _log(chalk.green(`proxyUrl:${proxyUrl}`))
    message && _log(chalk.green(`message: ${message}`))
}

const handleInterceptorError = function({ error, type, proxyUrl, targetUrl }) {
    if (!isEnabled) return
    _log(chalk.red(startLine()))
    _log(chalk.red(`${type}:handleInterceptorError`))
    _log(chalk.red(`targetUrl:${targetUrl}`))
    _log(chalk.red(`proxyUrl:${proxyUrl}`))
    _log(chalk.red(`error:${error}`))
}

module.exports = {
   handleInterceptor,
   handleInterceptorError,
}
