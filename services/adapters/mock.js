const mock = require('../../data/mock')
const orderStore = require('../../utils/orders')

function getStore() {
  return Promise.resolve({ ...mock.store })
}

function getCatalog() {
  return Promise.resolve({
    categories: mock.categories.map(i => ({ ...i })),
    products: mock.products.map(i => ({ ...i, skus: i.skus ? i.skus.map(s => ({ ...s })) : [] }))
  })
}

function getOrders() {
  return Promise.resolve(orderStore.listOrders())
}

function getOrder(id) {
  return Promise.resolve(orderStore.getOrder(id) || null)
}

function submitOrder(payload) {
  return Promise.resolve(orderStore.createOrder(payload))
}

function getUserInfo() {
  return Promise.resolve({ ...mock.user })
}

function prepareWechatSession() {
  return Promise.resolve({ openId: 'mock-openid' })
}

function loginWithPhonePayload() {
  return Promise.resolve({
    accessToken: 'mock-access-token',
    userInfo: { ...mock.user }
  })
}

function payOrder() {
  return Promise.resolve({ mock: true })
}

module.exports = {
  getStore,
  getCatalog,
  getOrders,
  getOrder,
  submitOrder,
  getUserInfo,
  prepareWechatSession,
  loginWithPhonePayload,
  payOrder
}
