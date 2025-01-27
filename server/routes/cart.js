import express from 'express';
const router = express.Router();
import { getCart, updateQuantity, removeItem, clearCart } from '../controllers/cartController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';

// 获取购物车
router.get('/', authMiddleware, getCart);

// 修改商品数量
router.put('/:productId/quantity', authMiddleware, updateQuantity);

// 删除商品
router.delete('/:productId', authMiddleware, removeItem);

// 清空购物车
router.delete('/', authMiddleware, clearCart);

export default router;
