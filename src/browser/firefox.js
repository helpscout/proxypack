var launchFirefox = require('firefox-launch')
const { PROXY_PACK_CONFIG_DIR } = require('../constants/config')

function openFirefox(domain) {
  const pref = [
    'user_pref("network.proxy.http", "localhost");',
    'user_pref("network.proxy.http_port", 7777);',
    'user_pref("network.proxy.ssl", "localhost");',
    'user_pref("network.proxy.ssl_port", 7777);',
    'user_pref("network.proxy.share_proxy_settings", true);',
    'user_pref("network.proxy.type", 1);',
    'user_pref("network.proxy.no_proxies_on", "");',
    'user_pref("browser.shell.checkDefaultBrowser", false);',
    'user_pref("browser.bookmarks.restore_default_bookmarks", false);',
    'user_pref("dom.allow_scripts_to_close_windows", true);',
  ].join('\n')

  const args = ['-foreground']

  const instance = launchFirefox(domain, {
    args,
    dir: `${PROXY_PACK_CONFIG_DIR}/firefox_profile`,
    pref,
  })

  instance.on('close', () => {
    // console.log('close')
  })
}

module.exports = openFirefox
