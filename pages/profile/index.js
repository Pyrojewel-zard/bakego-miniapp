const api = require('../../services/api')
const env = require('../../config/env')

Page({
  data: {
    user: getApp().globalData.user || {},
    loggedIn: !!api.getToken(),
    apiMode: api.API_MODE,
    sessionReady: false,
    openid: wx.getStorageSync(env.OPENID_KEY) || ''
  },
  onShow() {
    if (this.getTabBar()) this.getTabBar().setData({ selected: 3 })
    this.refreshUser()
    if (api.API_MODE === 'yshop' && !this.data.openid) this.prepareSession()
  },
  async refreshUser() {
    if (api.API_MODE === 'yshop' && !api.getToken()) {
      this.setData({ user: getApp().globalData.user || {}, loggedIn: false })
      return
    }
    try {
      const user = await api.getUserInfo()
      getApp().globalData.user = user
      this.setData({ user, loggedIn: api.isMock ? true : !!api.getToken() })
    } catch (err) {
      console.warn('[profile] user info unavailable', err)
    }
  },
  prepareSession() {
    if (api.isMock) {
      this.setData({ sessionReady: true, openid: 'mock-openid' })
      return
    }
    wx.login({
      success: async res => {
        try {
          const data = await api.prepareWechatSession(res.code)
          const openid = data && (data.openId || data.openid)
          if (openid) {
            wx.setStorageSync(env.OPENID_KEY, openid)
            this.setData({ openid, sessionReady: true })
          }
        } catch (err) {
          console.error('[profile] auth-session', err)
        }
      }
    })
  },
  async mockLogin() {
    const data = await api.loginWithPhonePayload({})
    api.setToken(data.accessToken || 'mock-access-token')
    getApp().globalData.user = data.userInfo
    this.setData({ user: data.userInfo, loggedIn: true })
    wx.showToast({ title: '模拟登录成功' })
  },
  async getPhoneNumber(e) {
    const detail = e.detail || {}
    if (!detail.encryptedData || !detail.iv) {
      wx.showModal({
        title: '登录接口需适配',
        content: '当前 yshop-drink 开源前端使用 encryptedData + iv + openid 的旧版手机号授权形态。你的微信基础库若只返回 phone code，需要在 Spring Boot 登录接口增加新 getPhoneNumber code 适配。',
        showCancel: false
      })
      return
    }
    let openid = this.data.openid
    if (!openid) {
      await new Promise(resolve => {
        wx.login({
          success: async res => {
            try {
              const session = await api.prepareWechatSession(res.code)
              openid = session && (session.openId || session.openid)
              if (openid) wx.setStorageSync(env.OPENID_KEY, openid)
            } catch (err) {
              console.error(err)
            }
            resolve()
          },
          fail: resolve
        })
      })
    }
    if (!openid) {
      wx.showToast({ title: '获取 openid 失败', icon: 'none' })
      return
    }
    wx.showLoading({ title: '登录中' })
    try {
      const data = await api.loginWithPhonePayload({
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        openid
      })
      const user = data && data.userInfo ? require('../../services/normalize').normalizeUser(data.userInfo) : getApp().globalData.user
      getApp().globalData.user = user
      this.setData({ user, loggedIn: true, openid })
      wx.showToast({ title: '登录成功' })
    } catch (err) {
      wx.showToast({ title: err.message || '登录失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },
  member() { wx.navigateTo({ url: '/pages/member/index' }) },
  orders() { wx.switchTab({ url: '/pages/orders/index' }) },
  address() { wx.showToast({ title: '地址页下一步接 yshop address API', icon: 'none' }) },
  support() { wx.showToast({ title: '客服入口已预留', icon: 'none' }) },
  about() { wx.showToast({ title: '联系我们入口已预留', icon: 'none' }) },
  policy() { wx.showToast({ title: '协议政策入口已预留', icon: 'none' }) }
})
