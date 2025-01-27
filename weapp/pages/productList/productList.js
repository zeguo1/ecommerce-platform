Page({
  data: {
    keyword: '', // 搜索关键词
    sortIndex: 0, // 当前排序索引
    sortOptions: [
      { value: 'default', text: '默认排序' },
      { value: 'price_asc', text: '价格升序' },
      { value: 'price_desc', text: '价格降序' },
      { value: 'sales_desc', text: '销量优先' }
    ],
    categoryIndex: 0, // 当前分类索引
    categoryOptions: [], // 分类选项
    productList: [], // 商品列表
    page: 1, // 当前页码
    pageSize: 10, // 每页数量
    hasMore: true // 是否还有更多数据
  },

  onLoad(options) {
    this.setData({
      keyword: options.keyword || ''
    });
    this.getCategories();
    this.getProductList();
  },

  // 获取分类数据
  getCategories() {
    const app = getApp();
    wx.request({
      url: `${app.globalData.baseUrl}/categories`,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            categoryOptions: [{ id: 0, name: '全部分类' }, ...res.data.data]
          });
        }
      }
    });
  },

  // 获取商品列表
  getProductList() {
    const app = getApp();
    const { keyword, sortIndex, categoryIndex, page, pageSize } = this.data;
    const params = {
      keyword,
      sort: this.data.sortOptions[sortIndex].value,
      categoryId: this.data.categoryOptions[categoryIndex].id,
      page,
      pageSize
    };

    app.showLoading();
    wx.request({
      url: `${app.globalData.baseUrl}/products`,
      data: params,
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            productList: page === 1 ? res.data.data : this.data.productList.concat(res.data.data),
            hasMore: res.data.data.length >= pageSize
          });
        }
      },
      complete: () => {
        app.hideLoading();
      }
    });
  },

  // 处理搜索输入
  handleSearch(e) {
    this.setData({
      keyword: e.detail.value
    });
    this.refreshProductList();
  },

  // 处理排序选择
  handleSortChange(e) {
    this.setData({
      sortIndex: e.detail.value
    });
    this.refreshProductList();
  },

  // 处理分类选择
  handleCategoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value
    });
    this.refreshProductList();
  },

  // 刷新商品列表
  refreshProductList() {
    this.setData({
      page: 1
    });
    this.getProductList();
  },

  // 加载更多
  loadMore() {
    if (!this.data.hasMore) return;
    this.setData({
      page: this.data.page + 1
    });
    this.getProductList();
  },

  // 跳转商品详情
  goProductDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/productDetail/productDetail?id=${productId}`
    });
  }
});
