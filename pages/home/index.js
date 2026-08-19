const api = require('../../services/api')

Page({
  data: {
    store: {},
    banner: '/assets/banner.png',
    apiMode: api.API_MODE
  },
  onShow() {
    this.loadStore()
    if (this.getTabBar()) this.getTabBar().setData({ selected: 0 })
  },
  async loadStore() {
    try {
      const store = await api.getStore()
      getApp().globalData.store = store
      this.setData({ store })
    } catch (err) {
      console.error('[home] getStore', err)
      this.setData({ store: getApp().globalData.store })
    }
  },
  goMenu(e) {
    const mode = e.currentTarget.dataset.mode || 'delivery'
    getApp().globalData.mode = mode
    wx.switchTab({ url: '/pages/menu/index' })
  },
  goOrders() {
    wx.switchTab({ url: '/pages/orders/index' })
  },
  goMember() {
    wx.navigateTo({ url: '/pages/member/index' })
  },
  recharge() {
    wx.showToast({ title: '充值入口已预留，下一步接 yshop 充值接口', icon: 'none' })
  }
})
