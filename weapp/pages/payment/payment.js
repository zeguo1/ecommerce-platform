Page({
  data: {
    orderInfo: {}, // 订单信息
    paymentMethods: ['微信支付'], // 支付方式
    selectedMethod: '微信支付' // 当前选择的支付方式
  },

  onLoad(options) {
    // 获取订单信息
    this.setData({
      orderInfo: JSON.parse(options.orderInfo)
    })
  },

  // 选择支付方式
  selectMethod(e) {
    this.setData({
      selectedMethod: e.currentTarget.dataset.method
    })
  },

  // 获取支付参数
  async getPaymentParams() {
    const res = await wx.request({
      url: 'https://api.example.com/payment/wechat',
      method: 'POST',
      data: {
        orderId: this.data.orderInfo.id,
        totalFee: this.data.orderInfo.totalAmount * 100 // 单位：分
      }
    })
    return res.data
  },

  // 发起支付
  async handlePayment() {
    wx.showLoading({
      title: '支付中...',
      mask: true
    })

    try {
      // 获取支付参数
      const paymentParams = await this.getPaymentParams()

      // 调用微信支付API
      const res = await wx.requestPayment({
        timeStamp: paymentParams.timeStamp,
        nonceStr: paymentParams.nonceStr,
        package: paymentParams.package,
        signType: paymentParams.signType,
        paySign: paymentParams.paySign,
      })

      // 支付成功处理
      wx.redirectTo({
        url: `/pages/orderDetail/orderDetail?orderId=${this.data.orderInfo.id}`
      })
    } catch (error) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
      console.error('支付失败:', error)
    } finally {
      wx.hideLoading()
    }
  }
})
