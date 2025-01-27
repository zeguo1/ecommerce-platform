Page({
  data: {
    userInfo: {
      avatar: '../../images/default-avatar.png',
      nickname: '加载中...',
      phone: '绑定手机号：加载中...'
    }
  },

  onLoad() {
    this.getUserInfo()
  },

  getUserInfo() {
    // 模拟获取用户信息
    setTimeout(() => {
      this.setData({
        userInfo: {
          avatar: '../../images/default-avatar.png',
          nickname: '测试用户',
          phone: '绑定手机号：138****8888'
        }
      })
    }, 1000)
  },

  navigateToOrders() {
    wx.navigateTo({
      url: '/pages/userCenter/orders'
    })
  },

  navigateToAddress() {
    wx.navigateTo({
      url: '/pages/userCenter/address'
    })
  },

  navigateToSecurity() {
    wx.navigateTo({
      url: '/pages/userCenter/security'
    })
  }
})
