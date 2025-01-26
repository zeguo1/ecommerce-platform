// pages/index/index.js
const app = getApp();

Page({
  data: {
    products: [], // 商品列表
    loading: true, // 加载状态
    hasMore: true, // 是否有更多数据
    page: 1, // 当前页码
    pageSize: 10 // 每页数量
  },

  onLoad() {
    this.loadProducts();
  },

  // 加载商品数据
  loadProducts() {
    const { page, pageSize } = this.data;
    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/products`,
      method: 'GET',
      data: {
        page,
        pageSize
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            products: page === 1 ? res.data.products : this.data.products.concat(res.data.products),
            hasMore: res.data.hasMore,
            loading: false
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadProducts();
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      products: [],
      hasMore: true
    });
    this.loadProducts();
    wx.stopPullDownRefresh();
  },

  // 跳转商品详情
  goToProductDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },

  // 加入购物车
  addToCart(e) {
    const product = e.currentTarget.dataset.product;
    const cart = app.globalData.cart;
    const index = cart.findIndex(item => item.id === product.id);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  }
});
