import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    // 商品基本信息
    name: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specifications: [{
      key: String,
      value: String
    }],
    
    // 价格和库存
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    
    // 促销信息
    isOnSale: {
      type: Boolean,
      default: false,
    },
    saleStartDate: Date,
    saleEndDate: Date,
    
    // 评分和评论
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    
    // 物流信息
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    
    // 商品状态
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    
    // 微信小程序相关
    isWechatExclusive: {
      type: Boolean,
      default: false,
    },
    wechatPromotionPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
