module.exports = function({ proxyServer, domain }) {
  const banner = [
    '<div style="display: block; text-align: center; padding: 7px; width: 100%; background-color: #ffcc00; color: #000000; border-top: 1px solid #fff; box-sizing: border-box;">',
    '🎭 This browser is connected to ProxyPack and some files might be coming from alternative sources.',
    '</div>',
  ]

  function addInterceptor(domain) {
    proxyServer.intercept(
      {
        contentType: 'text/html; charset=UTF-8',
        phase: 'response',
        fullUrl: domain + '/*',
        as: '$',
      },
      (request, response, cycle) => {
        response.$('body').prepend(banner.join(' '))
      },
    )
  }
  domain && addInterceptor(domain)
}
