const path = require('path')
const fs = require('fs')

function init({
    dynamicMappings,
    getLocalUriFromAssetsByChunkName,
    proxyServer,
}) {
    function addInterceptor(targetUrl) {
        function handleInterceptor(request, response) {
            let filename = path.parse(request.url).base
            // should be able to write something better for this, but want to get
            // this in so we can start using it, and it can be fixed if we change
            // our file naming
            // webpack also has the following info which might come in handy later
            // hashFunction: 'md4',
            // hashDigest: 'hex',
            // hashDigestLength: 20,
            const nameWithoutHash = filename.substr(0, filename.length - 24)
            const localPath = getLocalUriFromAssetsByChunkName(nameWithoutHash)

            try {
                const webpackFile = fs.readFileSync(
                    localPath,
                    'utf8',
                )
                if (webpackFile) {
                    response.statusCode = 203
                    response.string = webpackFile
                    response.headers['proxypack-interceptor-type'] = 'dynamic'
                }
            } catch (error) {
                console.error('ProxyPack: There was an error serving a dynamicMappings file.')
                console.error(`${request.url} did not resolve to ${localPath}`)
                console.error(`${nameWithoutHash} might not exist.`)
                console.error(error)
            }
        }

        proxyServer.intercept(
            {
                phase: 'request',
                method: 'GET',
                as: 'string',
                fullUrl: targetUrl,
            },
            handleInterceptor,
        )
    }
    dynamicMappings && dynamicMappings.forEach(addInterceptor)
}

module.exports = {
    init,
}
