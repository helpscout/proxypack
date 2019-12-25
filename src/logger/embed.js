function getLogs() {
  return axios({
    method: 'post',
    url: 'http://localhost:17777/rpc',
    data: {
      openBrowser: true,
    },
  })
}

module.exports = getLogs
