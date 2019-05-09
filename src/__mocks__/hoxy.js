// this will be automocked in every jest test
// const hoxy = jest.genMockFromModule('hoxy')

module.exports = {
  createServer: function() {
    return this
  },
  listen: function(port, callback) {
    callback()
    return this
  },
}
