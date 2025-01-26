// routes/shipping.js
import express from 'express';
const router = express.Router();
import { getShippingOptions } from '../controllers/shippingController.js';

router.route('/').get(getShippingOptions);

export default router;
