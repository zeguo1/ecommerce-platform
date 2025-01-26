import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Remove image file if exists
      if (product.imageUrl) {
        const imagePath = path.join(
          path.resolve(),
          'uploads',
          product.imageUrl
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // 处理文件上传错误
    if (!req.file) {
      return res.status(400).json({ message: '请上传产品图片' });
    }

    // 获取并验证必填字段
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: '产品名称和价格是必填项' });
    }

    // 设置可选字段默认值
    const product = new Product({
      name,
      price,
      description: req.body.description || '暂无描述',
      category: req.body.category || '默认分类',
      countInStock: req.body.countInStock || 0,
      user: req.user._id,
      imageUrl: `/uploads/${req.file.filename}`
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      // Update image if new file uploaded
      if (req.file) {
        // Remove old image if exists
        if (product.imageUrl) {
          const oldImagePath = path.join(
            path.resolve(),
            'uploads',
            product.imageUrl
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        product.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
