const api = require('../../services/api')

function makeQr(seed) {
  const size = 21
  const cells = []
  const finder = (x,y,ox,oy) => {
    const dx=x-ox, dy=y-oy
    return dx>=0 && dx<7 && dy>=0 && dy<7 &&
      (dx===0||dx===6||dy===0||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4))
  }
  for (let y=0;y<size;y++) {
    for (let x=0;x<size;x++) {
      let dark = finder(x,y,0,0) || finder(x,y,14,0) || finder(x,y,0,14)
      if (!dark && !(x<8&&y<8) && !(x>12&&y<8) && !(x<8&&y>12)) {
        const n = (x*17 + y*31 + seed*13 + x*y*7) % 11
        dark = n < 5
      }
      cells.push(dark ? 1 : 0)
    }
  }
  return cells
}

function makeBars(seed) {
  const bars=[]
  for(let i=0;i<58;i++) bars.push({ w: [3,5,7,4][(i+seed)%4], g: [2,3,1][(i+seed)%3] })
  return bars
}

Page({
  data: {
    user: getApp().globalData.user || {},
    cells: [],
    bars: [],
    seconds: 60,
    timer: null
  },
  onShow() {
    this.refresh()
    this.startTicker()
  },
  back() { wx.navigateBack() },
  noop() {},
  onHide() { this.stopTicker() },
  onUnload() { this.stopTicker() },
  async refresh() {
    let user = getApp().globalData.user || {}
    try {
      if (api.isMock || api.getToken()) user = await api.getUserInfo()
    } catch (err) {
      console.warn('[member] user info unavailable', err)
    }
    getApp().globalData.user = user
    const seed = Number(user.id || 9051341) + Math.floor(Date.now() / 60000)
    this.setData({ user, cells: makeQr(seed), bars: makeBars(seed % 97), seconds: 60 })
  },
  startTicker() {
    this.stopTicker()
    const timer = setInterval(() => {
      const next = this.data.seconds - 1
      if (next <= 0) this.refresh()
      else this.setData({ seconds: next })
    }, 1000)
    this.setData({ timer })
  },
  stopTicker() {
    if (this.data.timer) clearInterval(this.data.timer)
    this.setData({ timer: null })
  }
})
