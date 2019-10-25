# ProxyPack

[![Build Status](https://travis-ci.org/helpscout/proxypack.svg?branch=master)](https://travis-ci.org/helpscout/proxypack)
[![npm version](https://badge.fury.io/js/%40helpscout%2Fproxypack.svg)](https://badge.fury.io/js/%40helpscout%2Fproxypack)

> ProxyPack is WebPack Plugin that allows you to serve Local Assets from Wepack against a Production Website in a Web Browser

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [API](#api)
- [Webpack Setup](#webpack-setup)
  - [Example 1:](#example-1)
- [External Mappings](#external-mappings)
- [Local Mappings](#local-mappings)
- [Install SSL Certificate](#install-ssl-certificate)
- [To View A Proxy Build](#to-view-a-proxy-build)
- [Thanks](#thanks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API

| Value            | Type   | Of                                                      |
| ---------------- | ------ | ------------------------------------------------------- |
| browser          | String | chrome, chromium, firefox, ie, opera, safari, phantomjs |
| domain           | String | WebSite URL                                             |
| localMappings    | Dict   | Mappings of files on the local file system              |
| externalMappings | Dict   | Production Assets / Folders                             |

## Webpack Setup

### Example 1:

Import the ProxyPackPlugin:

```
const ProxyPackPlugin = require('@helpscout/proxypack').WebpackPlugin
```

In Webpack config add the following:

```
new ProxyPackPlugin({
        browser: 'chrome',
        domain: 'https://secure.helpscout.net',
      })

```

## External Mappings

You can also target Non-Webpack files or other Webpack builds with the dictionary `externalMappings`, these will be resolved with a standard `HTTP GET REQUEST`.

```
new ProxyPackPlugin({
        browser: 'chrome',
        domain: 'https://secure.helpscout.net',
        externalMappings: {
            ' https://beacon-v2.helpscout.net/static/js/main.2.1.f3df77f2.js': 'http://localhost:3001/static/js/main.2.1.js'
          }
        ,
      })
```

In this example we are actually running another Webpack server where `http://localhost:3001/static/js/main.2.1.js` is built and we are linking that from our Proxy Server.

## Local Mappings

Local Mappings are resolved as `UTF8` through `fs.readFileSync()`, and are for paths that are on the local file system.

```
new ProxyPackPlugin({
        browser: 'chrome',
        domain: 'https://secure.helpscout.net',
        localMappings: {
         'https://dhmmnd775wlnp.cloudfront.net/*/css/styles.css' : `${__dirname}/site/css/styles.css`
        },
```

## Install SSL Certificate

To view a ProxyPack Build in a Web Browser you must also have a Spoofed SSL certificate installed on your system.

- [MacOS](docs/macos.md)

## To View A Proxy Build

You will need to `npm install @helpscout/proxypack -g`.

This will install CLI commands that can launch a Proxied Web Browser that is aware of the ProxyServer running via Webpack.

For example the command `proxypack` will open a Proxied Web Browser in `chrome`.

You can pass the `browser` and / or `domain` flag, to target specific builds and override the values in `ProxyPackPlugin` config.

For example: `proxypack --domain=https://secure.helpscout.net --browser=firefox`. Will open `https://secure.helpscout.net` in `Firefox` and Proxy all the Webpack assets and other mapped local or external assets.

## Thanks

ProxyPack was inspired by [Charles Proxy](https://www.charlesproxy.com/) and [James Proxy](https://github.com/james-proxy/james) and was built with [Hoxy](http://greim.github.io/hoxy/).
