// pages/cart/cart.js
const app = getApp();

Page({
  data: {
    cartItems: [], // 购物车商品
    totalPrice: 0, // 总价
    loading: true, // 加载状态
    paying: false // 支付状态
  },

  onLoad() {
    this.loadCart();
  },

  // 加载购物车数据
  loadCart() {
    wx.showLoading({
      title: '加载中...'
    });
    
    wx.request({
      url: app.globalData.apiBaseUrl + '/cart',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            cartItems: res.data,
            loading: false
          });
          this.calculateTotal();
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 计算总价
  calculateTotal() {
    const total = this.data.cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    this.setData({ totalPrice: total.toFixed(2) });
  },

  // 增加数量
  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    const item = cartItems[index];
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart/${item.id}/quantity`,
      method: 'PUT',
      data: {
        quantity: item.quantity + 1
      },
      success: (res) => {
        if (res.statusCode === 200) {
          cartItems[index].quantity += 1;
          this.setData({ cartItems });
          this.calculateTotal();
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 减少数量
  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    const item = cartItems[index];
    
    if (item.quantity > 1) {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/cart/${item.id}/quantity`,
        method: 'PUT',
        data: {
          quantity: item.quantity - 1
        },
        success: (res) => {
          if (res.statusCode === 200) {
            cartItems[index].quantity -= 1;
            this.setData({ cartItems });
            this.calculateTotal();
          } else {
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
      });
    }
  },

  // 删除商品
  removeItem(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    const item = cartItems[index];
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart/${item.id}`,
      method: 'DELETE',
      success: (res) => {
        if (res.statusCode === 200) {
          cartItems.splice(index, 1);
          this.setData({ cartItems });
          this.calculateTotal();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 去结算
  checkout() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({
        title: '请先添加商品',
        icon: 'none'
      });
      return;
    }

    this.handlePayment();
  },

  // 处理支付
  handlePayment() {
    if (this.data.paying) return;
    
    this.setData({ paying: true });
    wx.showLoading({ title: '支付中...' });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders`,
      method: 'POST',
      data: {
        items: this.data.cartItems,
        totalPrice: this.data.totalPrice
      },
      success: (res) => {
        if (res.statusCode === 201) {
          const orderId = res.data.id;
          this.requestPayment(orderId);
        } else {
          wx.showToast({
            title: '创建订单失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ paying: false });
        wx.hideLoading();
      }
    });
  },

  // 请求支付
  requestPayment(orderId) {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders/${orderId}/wechat/pay`,
      method: 'POST',
      success: (res) => {
        if (res.statusCode === 200) {
          const paymentParams = res.data;
          wx.requestPayment({
            ...paymentParams,
            success: () => {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              // 清空购物车
              this.setData({ cartItems: [], totalPrice: 0 });
            },
            fail: () => {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '获取支付参数失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  }
});
