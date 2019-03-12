# MacOS SSL Instructions

## Chrome

- Download the certificate here [proxypack.crt.pem](https://github.com/helpscout/proxypack/blob/develop/src/proxypack.crt.pem)
- GoTo -> Settings, then search for `Manage certificates`, click the link which will open KeychainAccess.app
- In KeychainAccess.app, Go to File -> Import Items, and import the file you downloaded
- Open the certificate in keychain access manager (you can search for `ACME Signing Authority Inc`)
- Open the certificate and make sure you select 'Always trust'

## FireFox

- Download the certificate here [proxypack.crt.pem](https://github.com/helpscout/proxypack/blob/develop/src/proxypack.crt.pem)
- GoTo -> Preferences
- Click Import
- Make sure you click the checkboxes to trust the certificate
- Click OK
