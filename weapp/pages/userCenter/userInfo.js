Page({
  data: {
    avatar: '../../images/default-avatar.png',
    nickname: '加载中...',
    phone: '绑定手机号：加载中...',
    isWechatBound: false,
    tempAvatar: '',
    tempNickname: ''
  },

  onLoad() {
    // 测试模式
    if (wx.getStorageSync('testMode')) {
      this.setData({
        avatar: '../../images/test-avatar.jpg',
        nickname: '测试用户',
        phone: '138****8888',
        isWechatBound: true,
        tempNickname: '测试用户'
      })
      return
    }
    
    this.getUserInfo()
  },

  getUserInfo() {
    // 模拟获取用户信息
    setTimeout(() => {
      this.setData({
        avatar: '../../images/default-avatar.png',
        nickname: '测试用户',
        phone: '138****8888',
        isWechatBound: true,
        tempNickname: '测试用户'
      })
    }, 1000)
  },

  // 测试方法
  enableTestMode() {
    wx.setStorageSync('testMode', true)
    wx.showToast({
      title: '测试模式已开启',
      icon: 'success'
    })
    this.onLoad()
  },

  disableTestMode() {
    wx.removeStorageSync('testMode')
    wx.showToast({
      title: '测试模式已关闭',
      icon: 'success'
    })
    this.onLoad()
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          tempAvatar: tempFilePath
        })
      }
    })
  },

  // 绑定昵称输入
  bindNicknameInput(e) {
    this.setData({
      tempNickname: e.detail.value
    })
  },

  // 保存个人信息
  saveProfile() {
    const { tempAvatar, tempNickname } = this.data
    
    wx.showLoading({
      title: '保存中...',
      mask: true
    })

    // 模拟保存操作
    setTimeout(() => {
      wx.hideLoading()
      
      this.setData({
        avatar: tempAvatar || this.data.avatar,
        nickname: tempNickname,
        tempAvatar: '',
        tempNickname: ''
      })

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }, 1500)
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
