Page({
  data: {
    banners: [],       // 轮播图数据
    categories: [],    // 分类导航数据
    recommendProducts: [] // 推荐商品数据
  },

  onLoad() {
    this.initData();
  },

  // 初始化页面数据
  initData() {
    this.getBanners();
    this.getCategories();
    this.getRecommendProducts();
  },

  // 获取轮播图数据
  getBanners() {
    const app = getApp();
    app.showLoading();
    
    wx.request({
      url: `${app.globalData.baseUrl}/banners`,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            banners: res.data.data
          });
        }
      },
      complete: () => {
        app.hideLoading();
      }
    });
  },

  // 获取分类导航数据
  getCategories() {
    const app = getApp();
    
    wx.request({
      url: `${app.globalData.baseUrl}/categories`,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            categories: res.data.data
          });
        }
      }
    });
  },

  // 获取推荐商品数据
  getRecommendProducts() {
    const app = getApp();
    
    wx.request({
      url: `${app.globalData.baseUrl}/products/recommend`,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            recommendProducts: res.data.data
          });
        }
      }
    });
  },

  // 处理搜索输入
  handleSearch(e) {
    const keyword = e.detail.value.trim();
    if (keyword) {
      wx.navigateTo({
        url: `/pages/productList/productList?keyword=${keyword}`
      });
    }
  },

  // 跳转商品详情
  goProductDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/productDetail/productDetail?id=${productId}`
    });
  }
});
