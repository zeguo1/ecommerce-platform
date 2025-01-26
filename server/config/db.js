import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30秒超时
      socketTimeoutMS: 45000, // 45秒超时
      connectTimeoutMS: 30000, // 30秒连接超时
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
