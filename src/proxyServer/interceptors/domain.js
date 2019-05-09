/**
 This interceptor is the first one too get hit in the stack of interceptors.
 Therefore some interesting things happen in this file. CSP needs a custom
 header, we inject an HTML banner and also check if we need to re-write scripts
 on the page.
 */

const log = require('../../logger/')

function init({
  domain,
  getLocalAssetURIsForWebpackEntry,
  proxyServer,
  useReplaceScriptBlockWithWebpackEntries,
}) {
  const banner = [
    '<div style="display: block; text-align: center; padding: 7px; width: 100%; background-color: #ffcc00; color: #000000; border-top: 1px solid #fff; box-sizing: border-box;">',
    '🎭 This browser is connected to ProxyPack and some files might be coming from alternative sources.',
    '</div>',
  ]
  function addInterceptor(domain) {
    function handleInterceptor(request, response, cycle) {
      /*  The domain is the first thing that loads, so we set the branch name here
      beacause it could have changed between refreshes, instead of detecting when
      a new git branch is checked out, we can just set it when the browser loads */
      // in the case of working from Webpack4 chunks, the number of scripts
      // may not be the same in local as prod, this is why we remove the scripts
      // and then re-add them
      try {
        if (useReplaceScriptBlockWithWebpackEntries) {
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
            const scriptsForWebpackEntryPoint = getLocalAssetURIsForWebpackEntry(
              scriptGroup,
            ).map(_entry => {
              return `<script src="${_entry}" proxypack-entry="${scriptGroup}" type="text/javascript"></script>`
            })
            scriptGroups[scriptGroup].replaceWith(scriptsForWebpackEntryPoint)
          }
        }

        log.handleInterceptor({
          proxyUrl: domain + '/*',
          targetUrl: domain + '/*',
          type: 'domain',
        })
        // hack the CSP header
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
        response.headers[
          'content-security-policy'
        ] = `default-src * 'unsafe-inline'; font-src * data: 'unsafe-inline'; connect-src * 'unsafe-inline'; style-src * 'unsafe-inline'; script-src * 'unsafe-inline'; img-src *;`
        // proxypack custom headers
        // response.statusCode = 203
        response.headers['proxypack-interceptor-type'] = 'domain'
        // response.headers['proxypack-git-branch'] = getBranchName()
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
