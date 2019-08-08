/*
This interceptor is the first one too get hit in the stack of interceptors.
  - CSP headers are checked and merged if they exist
  - we search the page for any script tags
  - if they are webpack scripts, we proxy them
  - we inject an HTML banner into the page
 */

const log = require('../../logger/')
const state = require('../state')
const Policy = require('csp-parse')

function init() {
  const { domain, proxyServer, localWebpackServerURL } = state.get()

  const banner = [
    '<div style="display: block; text-align: center; padding: 7px; width: 100%; background-color: #ffcc00; color: #000000; border-top: 1px solid #fff; box-sizing: border-box;">',
    '🎭 This browser is connected to ProxyPack and some files might be coming from alternative sources.',
    '</div>',
  ]
  function addInterceptor(domain) {
    log.handleAddInterceptor({
      type: 'domain',
      targetUrl: domain + '/*',
    })
    function handleInterceptor(request, response, cycle) {
      /*
      In the case of working with Webpack4 chunks, the number of scripts on the
      page may not be the same in Local as on Prod (beacuse of code spliting,
      the script can change when you are working on it), the hashes  may also
      not match, this is why we remove the scripts, and then readd them
      */
      try {
        const scriptGroups = {}
        // get all the script groups
        response.$('script[webpack-entry]').each(function(index) {
          const newScript = response.$(this).attr('webpack-entry')
          if (!scriptGroups[newScript]) {
            scriptGroups[newScript] = response.$(this)
          } else {
            response.$(this).remove()
          }
        })

        // lookup the webpack entry points and remount them
        for (let scriptGroup in scriptGroups) {
          const scriptsForWebpackEntryPoint = state
            .getLocalAssetURIsForWebpackEntry(scriptGroup)
            .map(_entry => {
              return `<script src="${_entry}" proxypack-entry="${scriptGroup}" type="text/javascript"></script>`
            })
          scriptsForWebpackEntryPoint.unshift(
            `<script>window.proxyPackDynamicUrl='${localWebpackServerURL}/'</script>`,
          )

          scriptGroups[scriptGroup].replaceWith(scriptsForWebpackEntryPoint)
        }

        log.handleInterceptor({
          proxyUrl: domain + '/*',
          targetUrl: domain + '/*',
          type: 'domain',
        })

        const currentPolicy = response.headers['content-security-policy']

        // if a CSP Header exists we merge our localWebpackServerURL into it
        if (currentPolicy) {
          const policy = new Policy(response.headers['content-security-policy'])
          policy.add('script-src', localWebpackServerURL)
          policy.add('connect-src', 'wss://proxypack.local.sumoci.net:1337')
          response.headers['content-security-policy'] = policy.toString()
        }

        // proxypack custom headers
        // response.statusCode = 203
        response.headers['proxypack-interceptor-type'] = 'domain'
        response.$('body').prepend(banner.join(' '))
      } catch (error) {
        log.handleInterceptorError({
          error: error,
          proxyUrl: domain + '/*',
          targetUrl: domain + '/*',
          type: 'domain',
        })
      }
    }

    proxyServer.intercept(
      {
        contentType: 'text/html; charset=UTF-8',
        phase: 'response',
        as: '$',
        fullUrl: domain + '/*',
      },
      handleInterceptor,
    )
  }
  domain && addInterceptor(domain)
}

module.exports = {
  init,
}
