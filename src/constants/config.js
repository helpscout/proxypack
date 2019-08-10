const PROXY_PACK_CONFIG_DIR = `${process.env['HOME']}/.proxypack`

module.exports = {
  LOCAL_WEBPACK_SERVER: {
    PORT: 27777,
    URI: 'https://localhost:27777',
  },
  PROXY_PACK_CONFIG_DIR,
  SSL_CERTS: {
    CA: `${PROXY_PACK_CONFIG_DIR}/proxypack-private-root-ca.crt.pem`,
    CA_KEY: `${PROXY_PACK_CONFIG_DIR}/proxypack-private-root-ca.key.pem`,
    SERVER: `${PROXY_PACK_CONFIG_DIR}/proxypack-server.crt.pem`,
    SERVER_KEY: `${PROXY_PACK_CONFIG_DIR}/proxypack-server-key.pem`,
    SERVER_CSR: `${PROXY_PACK_CONFIG_DIR}/proxypack-server.csr.pem`,
  },
}
