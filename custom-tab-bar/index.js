Component({
  data: {
    selected: 0,
    items: [
      { text: '首页', pagePath: '/pages/home/index', icon: '⌂' },
      { text: '点单', pagePath: '/pages/menu/index', icon: '⌘' },
      { text: '会员码', pagePath: '/pages/member/index', icon: '▦', center: true },
      { text: '订单', pagePath: '/pages/orders/index', icon: '▤' },
      { text: '我的', pagePath: '/pages/profile/index', icon: '◯' }
    ]
  },
  methods: {
    onTap(e) {
      const index = Number(e.currentTarget.dataset.index)
      const item = this.data.items[index]
      if (item.center) {
        wx.navigateTo({ url: item.pagePath })
        return
      }
      wx.switchTab({ url: item.pagePath })
    }
  }
})
