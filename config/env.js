/**
 * Runtime switch for the merged adaptation.
 *
 * mock  : zero-backend mode, suitable for UI development and WeChat DevTools smoke tests.
 * yshop : connect to yshop-drink Spring Boot backend.
 */
module.exports = {
  API_MODE: 'mock',

  // yshop-drink upstream default development base URL is:
  // http://localhost:48081/app-api
  // For a real WeChat mini program, use an HTTPS domain added to the legal request domains.
  YSHOP_BASE_URL: 'http://localhost:48081/app-api',

  // 0 means let /store/nearby choose the nearest store.
  DEFAULT_STORE_ID: 0,

  // Fallback coordinates only used when yshop mode cannot obtain user location.
  DEFAULT_LOCATION: {
    latitude: 39.919990,
    longitude: 116.456270
  },

  REQUEST_TIMEOUT: 12000,
  TOKEN_KEY: 'bread_yshop_access_token',
  OPENID_KEY: 'bread_yshop_openid'
}
