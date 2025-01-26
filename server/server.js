import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/auth.js';
import adminOrderRoutes from './routes/adminOrders.js';
import shippingRoutes from './routes/shipping.js';

connectDB();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/orders', adminOrderRoutes); // защищенный маршрут для админских заказов
app.use('/api/admin/shipping', shippingRoutes); // защищенный маршрут для админской доставки


app.get('/', (req, res) => {
  res.send('E-commerce server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
