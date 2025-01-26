import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    获取所有商品
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    获取单个商品
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('商品未找到');
  }
});

// @desc    删除商品
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: '商品已删除' });
  } else {
    res.status(404);
    throw new Error('商品未找到');
  }
});

// @desc    创建商品
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    images,
    brand,
    category,
    countInStock,
    specifications,
    weight,
    dimensions,
    shippingClass,
    isOnSale,
    saleStartDate,
    saleEndDate,
    isFeatured,
    isWechatExclusive,
    wechatPromotionPrice
  } = req.body;

  const product = new Product({
    name,
    price,
    originalPrice,
    description,
    images,
    brand,
    category,
    countInStock,
    specifications,
    weight,
    dimensions,
    shippingClass,
    isOnSale,
    saleStartDate,
    saleEndDate,
    isFeatured,
    isWechatExclusive,
    wechatPromotionPrice,
    user: req.user._id
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    更新商品
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    images,
    brand,
    category,
    countInStock,
    specifications,
    weight,
    dimensions,
    shippingClass,
    isOnSale,
    saleStartDate,
    saleEndDate,
    isFeatured,
    isWechatExclusive,
    wechatPromotionPrice
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.originalPrice = originalPrice;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.specifications = specifications;
    product.weight = weight;
    product.dimensions = dimensions;
    product.shippingClass = shippingClass;
    product.isOnSale = isOnSale;
    product.saleStartDate = saleStartDate;
    product.saleEndDate = saleEndDate;
    product.isFeatured = isFeatured;
    product.isWechatExclusive = isWechatExclusive;
    product.wechatPromotionPrice = wechatPromotionPrice;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('商品未找到');
  }
});

// @desc    创建商品评价
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('您已经评价过该商品');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: '评价已添加' });
  } else {
    res.status(404);
    throw new Error('商品未找到');
  }
});

// @desc    获取热门商品
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
