Page({
  data: {
    orders: []
  },

  onLoad() {
    this.loadOrders();
  },

  loadOrders() {
    // 模拟订单数据
    const orders = [
      {
        id: 1,
        orderNumber: '20250127123456',
        status: '待付款',
        products: [
          {
            id: 1,
            name: '商品1',
            price: 99.00,
            quantity: 1,
            image: 'https://example.com/product1.jpg'
          }
        ],
        totalQuantity: 1,
        totalAmount: 99.00
      },
      {
        id: 2,
        orderNumber: '20250127123457',
        status: '待收货',
        products: [
          {
            id: 2,
            name: '商品2',
            price: 199.00,
            quantity: 2,
            image: 'https://example.com/product2.jpg'
          }
        ],
        totalQuantity: 2,
        totalAmount: 398.00
      }
    ];

    this.setData({
      orders: orders
    });
  },

  payOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '支付订单：' + orderId,
      icon: 'none'
    });
  },

  confirmReceipt(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '确认收货：' + orderId,
      icon: 'none'
    });
  },

  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + orderId
    });
  }
});
