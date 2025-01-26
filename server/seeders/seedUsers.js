import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/wangzeguo/dev/ecommerce-platform/server/.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
import User from '../models/User.js';

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 90000,
      connectTimeoutMS: 60000
    });
    console.log('Connected to MongoDB');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const users = [
      {
        name: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        isAdmin: false
      },
      {
        name: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      }
    ];

    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log('Current users:', users);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers().then(() => checkUsers());
