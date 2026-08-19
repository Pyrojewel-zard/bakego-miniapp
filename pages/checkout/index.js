const cartUtil = require('../../utils/cart')
const api = require('../../services/api')

Page({
  data: {
    mode: 'delivery',
    store: {},
    cart: [],
    total: '0.00',
    note: '',
    pickupTime: '尽快取餐',
    gettime: 0,
    submitting: false
  },
  onShow() {
    const cart = cartUtil.getCart()
    const s = cartUtil.summary(cart)
    this.setData({
      mode: getApp().globalData.mode || 'delivery',
      store: getApp().globalData.store,
      cart,
      total: s.total.toFixed(2)
    })
  },
  onNote(e) {
    this.setData({ note: e.detail.value })
  },
  chooseTime() {
    const options = [
      { label: '尽快取餐', minutes: 0 },
      { label: '20分钟后', minutes: 20 },
      { label: '30分钟后', minutes: 30 },
      { label: '1小时后', minutes: 60 }
    ]
    wx.showActionSheet({
      itemList: options.map(i => i.label),
      success: r => this.setData({ pickupTime: options[r.tapIndex].label, gettime: options[r.tapIndex].minutes })
    })
  },
  async submit() {
    if (this.data.submitting || !this.data.cart.length) return

    if (api.API_MODE === 'yshop' && !api.getToken()) {
      wx.showModal({
        title: '需要登录',
        content: '当前已切换到 yshop 后端模式，请先在“我的”页面完成登录。',
        showCancel: false
      })
      return
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: '提交订单' })
    try {
      const user = getApp().globalData.user || {}
      const order = await api.submitOrder({
        mode: this.data.mode,
        store: this.data.store,
        items: this.data.cart,
        total: Number(this.data.total),
        note: this.data.note,
        pickupTime: this.data.pickupTime,
        gettime: this.data.gettime,
        mobile: user.mobile || '',
        addressId: 0,
        couponId: 0,
        payType: 'weixin'
      })
      cartUtil.clearCart()
      wx.showToast({ title: api.isMock ? '下单成功' : '订单已创建', icon: 'success' })
      setTimeout(() => {
        if (order && order.id) {
          wx.redirectTo({ url: `/pages/order-detail/index?id=${encodeURIComponent(order.id)}` })
        } else {
          wx.switchTab({ url: '/pages/orders/index' })
        }
      }, 500)
    } catch (err) {
      console.error('[checkout] submit', err)
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
    } finally {
      wx.hideLoading()
      this.setData({ submitting: false })
    }
  }
})
