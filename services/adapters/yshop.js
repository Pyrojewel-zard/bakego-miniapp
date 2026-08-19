const env = require('../../config/env')
const http = require('../request')
const n = require('../normalize')

function locate() {
  return new Promise(resolve => {
    wx.getLocation({
      type: 'wgs84',
      success: resolve,
      fail: () => resolve(env.DEFAULT_LOCATION)
    })
  })
}

async function getStore(options = {}) {
  const location = options.location || await locate()
  const raw = await http.request('/store/nearby', {
    login: false,
    data: {
      lat: location.latitude,
      lng: location.longitude,
      shop_id: options.shopId != null ? options.shopId : env.DEFAULT_STORE_ID,
      kw: ''
    }
  })
  return n.normalizeStore(raw)
}

async function getCatalog(options = {}) {
  let shopId = options.shopId
  if (!shopId) {
    const store = await getStore(options)
    shopId = store.id
  }
  const raw = await http.request('/product/products', {
    login: false,
    data: { shopId }
  })
  return n.normalizeCatalog(raw)
}

async function getOrders(params = {}) {
  const raw = await http.request('/order/list', { data: params })
  const list = Array.isArray(raw) ? raw : (raw && (raw.list || raw.records || raw.data)) || []
  return list.map(n.normalizeOrder)
}

async function getOrder(id) {
  const raw = await http.request(`/order/detail/${id}`, { data: {} })
  return n.normalizeOrder(raw)
}

function toSubmitPayload(payload = {}) {
  const items = payload.items || []
  return {
    orderType: payload.mode === 'pickup' ? 'takein' : 'takeout',
    addressId: payload.mode === 'delivery' ? (payload.addressId || 0) : 0,
    shopId: payload.store && payload.store.id,
    mobile: payload.mobile || '',
    gettime: payload.gettime != null ? payload.gettime : 0,
    payType: payload.payType || 'weixin',
    remark: payload.note || '',
    productId: items.map(i => i.productId),
    spec: items.map(i => String(i.specKey || i.skuName || '').replace(/,/g, '|')),
    number: items.map(i => i.qty),
    couponId: payload.couponId || 0
  }
}

async function submitOrder(payload) {
  const raw = await http.request('/order/create', {
    method: 'POST',
    data: toSubmitPayload(payload)
  })
  if (raw && (raw.id || raw.orderId || raw.order_id)) return n.normalizeOrder(raw)
  return {
    id: String(raw && (raw.orderId || raw.id) || ''),
    no: raw && (raw.orderId || raw.id) || '',
    status: '未支付',
    createdAt: '',
    mode: payload.mode,
    store: payload.store,
    items: payload.items,
    total: payload.total,
    note: payload.note || '',
    raw
  }
}

function payOrder(data) {
  return http.request('/order/pay', { method: 'POST', data })
}

async function getUserInfo() {
  const raw = await http.request('/member/user/get-info', { data: {} })
  return n.normalizeUser(raw)
}

function prepareWechatSession(code) {
  return http.request('/member/auth/auth-session', {
    method: 'POST',
    login: false,
    data: { code }
  })
}

async function loginWithPhonePayload(payload) {
  const raw = await http.request('/member/auth/auth-miniapp-login', {
    method: 'POST',
    login: false,
    data: payload
  })
  if (raw && raw.accessToken) http.setToken(raw.accessToken)
  return raw
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
  payOrder,
  toSubmitPayload
}
