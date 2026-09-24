import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pmmanagement';
  try {
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    // In dev environment, don't crash hard if local Mongo isn't running immediately
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
