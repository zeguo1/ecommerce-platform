Page({
  data: {
    order: null
  },

  onLoad(options) {
    const orderId = options.id;
    this.loadOrderDetail(orderId);
  },

  loadOrderDetail(orderId) {
    // 模拟订单详情数据
    const order = {
      id: orderId,
      orderNumber: '20250127123456',
      status: '待付款',
      createTime: '2025-01-27 08:00:00',
      products: [
        {
          id: 1,
          name: '商品1',
          price: 99.00,
          quantity: 1,
          image: 'https://example.com/product1.jpg'
        }
      ],
      totalAmount: 99.00,
      shippingFee: 0,
      payAmount: 99.00
    };

    this.setData({
      order: order
    });
  },

  payOrder() {
    wx.showToast({
      title: '支付订单：' + this.data.order.id,
      icon: 'none'
    });
  },

  confirmReceipt() {
    wx.showToast({
      title: '确认收货：' + this.data.order.id,
      icon: 'none'
    });
  }
});
