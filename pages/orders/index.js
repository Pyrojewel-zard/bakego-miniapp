const api = require('../../services/api')

Page({
  data: {
    tabs: ['门店订单','历史订单','储值订单','买单订单','券包订单'],
    active: 0,
    orders: [],
    loading: false
  },
  onShow() {
    this.refresh()
    if (this.getTabBar()) this.getTabBar().setData({ selected: 2 })
  },
  async refresh() {
    this.setData({ loading: true })
    try {
      const orders = await api.getOrders({ pageNo: 1, pageSize: 30 })
      this.setData({ orders: orders || [] })
    } catch (err) {
      console.error('[orders] refresh', err)
      this.setData({ orders: [] })
    } finally {
      this.setData({ loading: false })
    }
  },
  switchTab(e) {
    this.setData({ active: Number(e.currentTarget.dataset.index) })
  },
  detail(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${encodeURIComponent(e.currentTarget.dataset.id)}` })
  }
})
