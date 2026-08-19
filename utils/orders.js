const KEY = 'bread_yshop_orders_v1'

function listOrders() {
  return wx.getStorageSync(KEY) || []
}

function createOrder(payload) {
  const orders = listOrders()
  const now = new Date()
  const id = 'B' + now.getTime()
  const order = {
    id,
    no: id,
    status: '待制作',
    createdAt: formatDate(now),
    ...payload
  }
  orders.unshift(order)
  wx.setStorageSync(KEY, orders)
  return order
}

function getOrder(id) {
  return listOrders().find(i => String(i.id) === String(id))
}

function formatDate(date) {
  const p = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}`
}

module.exports = { listOrders, createOrder, getOrder }
