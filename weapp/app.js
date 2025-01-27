App({
  onLaunch() {
    // 小程序初始化时执行
    this.initApp();
  },

  globalData: {
    userInfo: null, // 用户信息
    cartCount: 0,   // 购物车商品数量
    baseUrl: 'https://api.example.com' // 接口基础地址
  },

  // 初始化应用
  initApp() {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 获取系统信息
    this.getSystemInfo();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      // 如果有token，获取用户信息
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo() {
    wx.request({
      url: `${this.globalData.baseUrl}/user/info`,
      success: (res) => {
        if (res.data.code === 0) {
          this.globalData.userInfo = res.data.data;
        }
      }
    });
  },

  // 获取系统信息
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      }
    });
  },

  // 显示加载提示
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  // 隐藏加载提示
  hideLoading() {
    wx.hideLoading();
  },

  // 显示提示信息
  showToast(title, icon = 'none') {
    wx.showToast({
      title,
      icon,
      duration: 2000
    });
  }
});
