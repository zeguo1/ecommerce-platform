// pages/cart/cart.js
const app = getApp();

Page({
  data: {
    cartItems: [], // 购物车商品
    totalPrice: 0, // 总价
    loading: true // 加载状态
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

    wx.navigateTo({
      url: '/pages/order/checkout'
    });
  }
});
