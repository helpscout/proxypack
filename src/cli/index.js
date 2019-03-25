#!/usr/bin/env node
const program = require('safe-commander')
const browser = require('../browser')

program
  .version('0.1.0')
  .option('-b, --browser [value]', 'Start as browser')
  .option('-d, --domain [value]', 'Domain to launch')
  .parse(process.argv)

browser.initBrowser({
  browser: program.optsObj.browser,
  domain: program.optsObj.domain,
})
