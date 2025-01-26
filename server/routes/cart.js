const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// 获取购物车
router.get('/', authMiddleware, cartController.getCart);

// 修改商品数量
router.put('/:productId/quantity', authMiddleware, cartController.updateQuantity);

// 删除商品
router.delete('/:productId', authMiddleware, cartController.removeItem);

// 清空购物车
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
