import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  generateWechatPayParams,
  verifyWechatPayment,
  handleWechatCallback,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/wechat/pay').post(protect, generateWechatPayParams);
router.route('/:id/wechat/verify').post(protect, verifyWechatPayment);
router.route('/wechat/callback').post(handleWechatCallback);

export default router;
