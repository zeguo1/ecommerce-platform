Page({
  data: {
    addresses: []
  },

  onLoad() {
    this.getAddresses()
  },

  getAddresses() {
    // 模拟获取地址数据
    setTimeout(() => {
      this.setData({
        addresses: [
          {
            id: 1,
            name: '张三',
            phone: '13800138000',
            address: '北京市朝阳区xx路xx号'
          }
        ]
      })
    }, 1000)
  },

  addAddress() {
    wx.navigateTo({
      url: '/pages/userCenter/addressEdit'
    })
  },

  editAddress(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/userCenter/addressEdit?id=${id}`
    })
  },

  deleteAddress(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟删除地址
          this.setData({
            addresses: this.data.addresses.filter(item => item.id !== id)
          })
        }
      }
    })
  }
})
