/**
 This interceptor is the first one too get hit in the stack of interceptors.
 Therefore some interesting things happen in this file. CSP needs a custom
 header, we inject an HTML banner and also check if we need to re-write scripts
 on the page.
 */

const log = require('../../logger/')

function init({
  domain,
  getBranchName,
  getVirtualAssetURIsForWebpackEntry,
  getVirtualDomain,
  proxyServer,
  setBranchName
}) {
  const banner = [
    '<div style="display: block; text-align: center; padding: 7px; width: 100%; background-color: #ffcc00; color: #000000; border-top: 1px solid #fff; box-sizing: border-box;">',
    '🎭 This browser is connected to ProxyPack and some files might be coming from alternative sources.',
    '</div>',
  ]
  function addInterceptor(domain) {
    const virtualDomain = getVirtualDomain()

    function handleInterceptor(request, response, cycle) {
      return new Promise((resolve, reject) => {
      /*  The domain is the first thing that loads, so we set the branch name here
      beacause it could have changed between refreshes, instead of detecting when
      a new git branch is checked out, we can just set it when the browser loads */
      // return setBranchName().then(() => {
        // in the case of working from Webpack4 chunks, the number of scripts
        // may not be the same in local as prod, this is why we remove the scripts
        // and then re-add them

        try {
        response.$('script[webpack-entry]').each(function (index) {
          if (index === 0) {
            const mountingNode = response.$(this)
            const entry = mountingNode.attr('webpack-entry')
            const scripts = getVirtualAssetURIsForWebpackEntry(entry).map(_entry => {
              return `<script src="${_entry}" proxypack-entry="${entry}"></script>`
            })
            mountingNode.replaceWith(scripts)
          } else {
            response.$(this).remove()
          }
        })

        log.handleInterceptor({
          proxyUrl: domain + '/*',
          targetUrl: domain + '/*',
          type: 'domain',
        })
        // hack the CSP header
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
        response.headers['content-security-policy'] = `default-src * 'unsafe-inline'; font-src * data: 'unsafe-inline'; connect-src * 'unsafe-inline'; style-src * 'unsafe-inline'; script-src * 'unsafe-inline'; img-src *;`
        // proxypack custom headers
        response.headers['proxypack-interceptor-type'] = 'domain'
        response.headers['proxypack-git-branch'] = getBranchName()
        response.$('body').prepend(banner.join(' '))
        resolve()
      } catch (error) {
        log.handleInterceptorError({
          error: error,
          proxyUrl: domain + '/*',
          targetUrl: domain + '/*',
          type: 'domain',
        })
        reject()
      }
      })
    }

    proxyServer.intercept(
      {
        contentType: 'text/html; charset=UTF-8',
        phase: 'response',
        fullUrl: domain + '/*',
        as: '$',
      },
      handleInterceptor,
    )
  }
  domain && addInterceptor(domain)
}

module.exports = {
  init,
}
