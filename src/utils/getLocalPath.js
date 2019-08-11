const routePattern = require('route-pattern')
const DOMAIN_WITH_WILD_CARDS = /http(?:s)?:\/\/(?:[\w-\*]+\.)*([\w-\*]{1,63})(?:\.(?:\w{3}|\w{2}))(?:$|\/)/

function getPathFromUri(uri) {
  return uri.replace(DOMAIN_WITH_WILD_CARDS, '')
}

function getLocalPath({ localLocation, requestUrl, targetUrl }) {
  let _localLocation = localLocation
  const path = getPathFromUri(targetUrl)
  const pattern = routePattern.fromString(path)
  if (pattern) {
    const match = pattern.match(requestUrl)
    if (match) {
      _localLocation += match.params.map(param => param).join('/')
    }
  }
  return _localLocation
}

module.exports = getLocalPath
