const path = require('path')
const log = require('../../logger')

function init({
    dynamicMappings,
    getLocalUriFromAssetsByChunkName,
    proxyServer,
}) {
    function addInterceptor(targetUrl) {
        function handleInterceptor(request, response, cycle) {
            let filename = path.parse(request.url).base

            // this also needs some tweaking to match evey webpack config imaginable but a quick fix for now
            let nameWithoutHash
            const isMap = filename.substring(filename.length - 3, filename.length) === 'map'
            if(isMap) {
                nameWithoutHash =  filename.substr(0, filename.length - 28)
            } else {
                nameWithoutHash = filename.substr(0, filename.length - 24)
            }

            const localPath = getLocalUriFromAssetsByChunkName(nameWithoutHash, isMap)
            log.handleInterceptor({
                proxyUrl: localPath,
                targetUrl: request.url,
                type: 'dynamic'
            })
            response.statusCode = 203
            response.headers['proxypack-interceptor-type'] = 'dynamic'
            return cycle.serve(localPath)
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
