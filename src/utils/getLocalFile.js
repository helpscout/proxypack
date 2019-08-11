const fs = require('promise-fs')

const cache = {}

function getLocalFile(localLocation) {
  return fs.stat(localLocation).then(data => {
    const cachedFile = cache[localLocation]
    const ts = data.mtimeMS
    if (cachedFile && cachedFile.ts === ts) {
      return cachedFile.buffer
    } else {
      return fs.readFile(localLocation).then(data => {
        cache[localLocation] = {
          buffer: data,
          ts,
        }
        return data
      })
    }
  })
}

module.exports = getLocalFile
