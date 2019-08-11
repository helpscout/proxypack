const fs = require('promise-fs')
const mime = require('mime-types')

const cache = {}

function getLocalFile(localLocation) {
  return fs.stat(localLocation).then(data => {
    const cachedFile = cache[localLocation]
    const ts = data.mtimeMS
    if (cachedFile && cachedFile.ts === ts) {
      return cachedFile
    } else {
      return fs.readFile(localLocation).then(data => {
        cache[localLocation] = {
          buffer: data,
          contentType: mime.lookup(localLocation),
          ts,
        }
        return cache[localLocation]
      })
    }
  })
}

module.exports = getLocalFile
