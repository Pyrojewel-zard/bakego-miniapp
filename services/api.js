const env = require('../config/env')
const mock = require('./adapters/mock')
const yshop = require('./adapters/yshop')
const http = require('./request')

const adapter = env.API_MODE === 'yshop' ? yshop : mock

function use(method, ...args) {
  if (!adapter[method]) return Promise.reject(new Error(`Adapter method missing: ${method}`))
  return adapter[method](...args)
}

module.exports = {
  API_MODE: env.API_MODE,
  isMock: env.API_MODE === 'mock',
  getStore: (...args) => use('getStore', ...args),
  getCatalog: (...args) => use('getCatalog', ...args),
  getOrders: (...args) => use('getOrders', ...args),
  getOrder: (...args) => use('getOrder', ...args),
  submitOrder: (...args) => use('submitOrder', ...args),
  getUserInfo: (...args) => use('getUserInfo', ...args),
  prepareWechatSession: (...args) => use('prepareWechatSession', ...args),
  loginWithPhonePayload: (...args) => use('loginWithPhonePayload', ...args),
  payOrder: (...args) => use('payOrder', ...args),
  getToken: http.getToken,
  setToken: http.setToken
}
