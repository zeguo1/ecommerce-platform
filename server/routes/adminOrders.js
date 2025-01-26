import express from 'express';
const router = express.Router();
import { getAdminOrders } from '../controllers/adminOrderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getAdminOrders);

export default router;
