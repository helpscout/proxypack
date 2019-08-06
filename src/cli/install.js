const CONFIG = require('../constants/config')
const shell = require('shelljs')
const PROXY_PACK_CONFIG_DIR = CONFIG.PROXY_PACK_CONFIG_DIR

function install() {
  // remove directory if it already exists
  // shell.exec('sudo rm -rf', `${PROXY_PACK_CONFIG_DIR}/*`)
  shell.exec(`sudo rm -R ${PROXY_PACK_CONFIG_DIR}`)
  shell.exec(`sudo mkdir -p ${PROXY_PACK_CONFIG_DIR}`)

  console.log('Create root authority certificate:', '\n')

  // Create your very own Root Certificate Authority
  shell.exec(
    [`sudo`, `openssl`, `genrsa`, `-out ${CONFIG.SSL_CERTS.CA_KEY} 2048`].join(
      ' ',
    ),
  )

  console.log('\n', 'Self signing:', '\n')

  // Self-sign your Root Certificate Authority
  // Since this is private, the details can be as bogus as you like
  shell.exec(
    [
      `sudo`,
      `openssl`,
      `req`,
      `-x509`,
      `-new`,
      `-nodes`,
      `-key ${CONFIG.SSL_CERTS.CA_KEY}`,
      `-days 1024`,
      `-out ${CONFIG.SSL_CERTS.CA}`,
      `-subj "/C=US/ST=Utah/L=Provo/O=ACME Signing Authority Inc/CN=example.com"`,
    ].join(' '),
  )

  console.log('\n', 'Create device certificates:', '\n')

  // Create a Device Certificate for each domain,
  // such as example.com, *.example.com, awesome.example.com
  // NOTE: You MUST match CN to the domain name or ip address you want to use
  shell.exec(
    [
      `sudo`,
      `openssl`,
      `genrsa`,
      `-out ${CONFIG.SSL_CERTS.SERVER_KEY}`,
      `2048`,
    ].join(' '),
  )

  console.log('\n', 'Sign request from device:', '\n')

  // Create a request from your Device, which your Root CA will sign
  shell.exec(
    [
      `sudo`,
      `openssl`,
      `req`,
      `-new`,
      `-key ${CONFIG.SSL_CERTS.SERVER_KEY}`,
      `-out ${CONFIG.SSL_CERTS.SERVER_CSR}`,
      `-subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=localhost"`,
    ].join(' '),
  )

  // Sign the request from Device with your Root CA
  shell.exec(
    [
      `sudo`,
      `openssl`,
      `x509`,
      `-req`,
      `-in ${CONFIG.SSL_CERTS.SERVER_CSR}`,
      `-CA ${CONFIG.SSL_CERTS.CA}`,
      `-CAkey ${CONFIG.SSL_CERTS.CA_KEY}`,
      `-CAcreateserial`,
      `-out ${CONFIG.SSL_CERTS.SERVER}`,
      `-days 500`,
    ].join(' '),
  )

  // add CA to keychain
  shell.exec(
    [
      `sudo`,
      `security`,
      `add-trusted-cert`,
      `-d -r trustRoot -k`,
      `/Library/Keychains/System.keychain ${CONFIG.SSL_CERTS.CA}`,
    ].join(' '),
  )

  console.log('\n', `ProxyPack was successfully configured.`)
}

module.exports = {
  install,
}
