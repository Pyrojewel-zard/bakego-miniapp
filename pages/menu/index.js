const api = require('../../services/api')
const cartUtil = require('../../utils/cart')

Page({
  data: {
    store: {},
    mode: 'delivery',
    categories: [],
    products: [],
    shownProducts: [],
    activeCategory: '',
    cartCount: 0,
    cartTotal: '0.00',
    showSku: false,
    skuProduct: null,
    loading: true
  },
  onLoad() {
    this.loadMenu()
  },
  onShow() {
    this.setData({ mode: getApp().globalData.mode || 'delivery' })
    this.refreshCart()
    if (this.getTabBar()) this.getTabBar().setData({ selected: 1 })
  },
  async loadMenu() {
    wx.showNavigationBarLoading()
    try {
      let store = getApp().globalData.store
      if (!store || !store.id || api.API_MODE === 'yshop') {
        store = await api.getStore()
        getApp().globalData.store = store
      }
      const catalog = await api.getCatalog({ shopId: store.id })
      const categories = catalog.categories || []
      const products = catalog.products || []
      const preferred = categories.find(i => String(i.id) === 'fresh') || categories[categories.length - 1] || categories[0]
      const activeCategory = preferred ? String(preferred.id) : ''
      this.setData({
        store,
        categories,
        products,
        activeCategory,
        shownProducts: products.filter(p => String(p.categoryId) === activeCategory),
        loading: false
      })
    } catch (err) {
      console.error('[menu] load', err)
      wx.showToast({ title: err.message || '商品加载失败', icon: 'none' })
      this.setData({ loading: false })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  changeMode(e) {
    const mode = e.currentTarget.dataset.mode
    getApp().globalData.mode = mode
    this.setData({ mode })
  },
  selectCategory(e) {
    const id = String(e.currentTarget.dataset.id)
    this.setData({
      activeCategory: id,
      shownProducts: this.data.products.filter(p => String(p.categoryId) === id)
    })
  },
  addProduct(e) {
    const rawId = e.currentTarget.dataset.id
    const p = this.data.products.find(i => String(i.id) === String(rawId))
    if (!p) return
    if (p.stock <= 0) {
      wx.showToast({ title: '商品已售罄', icon: 'none' })
      return
    }
    if (p.hasSku) {
      this.setData({ showSku: true, skuProduct: p })
      return
    }
    cartUtil.addItem(p)
    this.refreshCart()
  },
  chooseSku(e) {
    const skuId = String(e.currentTarget.dataset.sku)
    const p = this.data.skuProduct
    const sku = (p.skus || []).find(i => String(i.id) === skuId)
    if (!sku) return
    if (sku.stock <= 0) {
      wx.showToast({ title: '该规格已售罄', icon: 'none' })
      return
    }
    cartUtil.addItem(p, sku)
    this.setData({ showSku: false })
    this.refreshCart()
  },
  closeSku() {
    this.setData({ showSku: false })
  },
  noop() {},
  refreshCart() {
    const s = cartUtil.summary()
    this.setData({ cartCount: s.count, cartTotal: s.total.toFixed(2) })
  },
  checkout() {
    if (!this.data.cartCount) {
      wx.showToast({ title: '请先选择商品', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/checkout/index' })
  }
})
