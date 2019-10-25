const shell = require('shelljs')

function setupSafariProxy() {
  shell.exec('networksetup -setwebproxy "Wi-fi" 127.0.0.1 7777')
  shell.exec('networksetup -setsecurewebproxy "Wi-fi" 127.0.0.1 7777')
}

function teardownSafariProxy() {
  shell.exec('networksetup -setwebproxystate "Wi-fi" off')
  shell.exec('networksetup -setsecurewebproxystate "Wi-fi" off')
}

module.exports = {
  setupSafariProxy,
  teardownSafariProxy,
}
