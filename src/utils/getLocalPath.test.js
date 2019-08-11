const getLocalPath = require('./getLocalPath')

describe('get local path', () => {
  it('should return correct path', () => {
    const requestUrl =
      'https://dhmmnd775wlnp.cloudfront.net/c8d529c347/css/icons.css'
    const targetUrl = 'https://*.cloudfront.net/*/css/:style'
    const localLocation = '/Users/tjbo/Projects/hs-app/site/css/'
    const expectedLocation = '/Users/tjbo/Projects/hs-app/site/css/icons.css'

    expect(getLocalPath({ targetUrl, localLocation, requestUrl })).toEqual(
      expectedLocation,
    )
  })

  it('should return correct path', () => {
    const requestUrl =
      'https://dhmmnd775wlnp.cloudfront.net/c8d529c347/css/icons.css'
    const targetUrl = 'https://dhmmnd775wlnp.cloudfront.net/*/css/:style'
    const localLocation = '/Users/tjbo/Projects/hs-app/site/css/'
    const expectedLocation = '/Users/tjbo/Projects/hs-app/site/css/icons.css'

    expect(getLocalPath({ targetUrl, localLocation, requestUrl })).toEqual(
      expectedLocation,
    )
  })

  it('should return correct path', () => {
    const requestUrl =
      'https://dhmmnd775wlnp.cloudfront.net/c8d529c347/images/folder1/thing.gif'
    const targetUrl =
      'https://dhmmnd775wlnp.cloudfront.net/*/images/*folder/:image'
    const localLocation = '/Users/tjbo/Projects/hs-app/site/images/'
    const expectedLocation =
      '/Users/tjbo/Projects/hs-app/site/images/folder1/thing.gif'

    expect(getLocalPath({ targetUrl, localLocation, requestUrl })).toEqual(
      expectedLocation,
    )
  })
  it('should return correct path', () => {
    const requestUrl =
      'https://dhmmnd775wlnp.cloudfront.net/c8d529c347/images/folder1/anotherFolder/veryNested/thing.gif'
    const targetUrl =
      'https://dhmmnd775wlnp.cloudfront.net/*/images/*folder/:image'
    const localLocation = '/Users/tjbo/Projects/hs-app/site/images/'
    const expectedLocation =
      '/Users/tjbo/Projects/hs-app/site/images/folder1/anotherFolder/veryNested/thing.gif'

    expect(getLocalPath({ targetUrl, localLocation, requestUrl })).toEqual(
      expectedLocation,
    )
  })
})
