Page({
  data: {
    phone: '138****8888',
    email: 'user@example.com',
    passwordLastChanged: '2025-01-01'
  },

  onLoad() {
    this.getSecurityInfo()
  },

  getSecurityInfo() {
    // 模拟获取安全信息
    setTimeout(() => {
      this.setData({
        phone: '138****8888',
        email: 'user@example.com',
        passwordLastChanged: '2025-01-01'
      })
    }, 1000)
  },

  changePhone() {
    wx.navigateTo({
      url: '/pages/userCenter/changePhone'
    })
  },

  changeEmail() {
    wx.navigateTo({
      url: '/pages/userCenter/changeEmail'
    })
  },

  changePassword() {
    wx.navigateTo({
      url: '/pages/userCenter/changePassword'
    })
  }
})
