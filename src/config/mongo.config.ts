import mongoose from 'mongoose';
import { logger } from '@/utils/logger.util';
import { env } from '@/config/env.config';

export const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ error: err }, 'MongoDB connection error');
    throw err;
  }
};

mongoose.connection.on('error', (err) => {
  logger.error({ error: err }, 'MongoDB runtime error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
