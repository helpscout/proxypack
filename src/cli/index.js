#!/usr/bin/env node
const program = require('safe-commander')
const browser = require('../browser')
const install = require('./install')
const shell = require('shelljs')

program
  .version('0.1.0')
  .option('-b, --browser [value]', 'Start as browser')
  .option('-d, --domain [value]', 'Domain to launch')
  .option('-i, --install', 'Install ProxyPack')
  .parse(process.argv)

if (program.optsObj.install) {
  install.install()
} else {
  browser.initBrowser({
    browser: program.optsObj.browser,
    domain: program.optsObj.domain,
  })
}
