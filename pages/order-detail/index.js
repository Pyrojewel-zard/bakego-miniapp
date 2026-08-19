const api = require('../../services/api')

Page({
  data: { order: null, loading: true },
  onLoad(query) {
    this.load(query.id)
  },
  async load(id) {
    try {
      const order = await api.getOrder(id)
      this.setData({ order, loading: false })
    } catch (err) {
      console.error('[order-detail]', err)
      this.setData({ order: null, loading: false })
    }
  },
  goOrders() {
    wx.switchTab({ url: '/pages/orders/index' })
  }
})
