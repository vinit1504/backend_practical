import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { logger } from './config/logger';

let isConnected = false;

const connectDb = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(config.mongoUri);
    isConnected = true;
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB', error);
  }
};

// Check if running on Vercel serverless platform
const isServerless = process.env.VERCEL === '1';

if (!isServerless) {
  // Local or standard server environment: start listening on PORT
  connectDb().then(() => {
    app.listen(config.port, () => {
      logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  });
} else {
  // Serverless environment: handle DB connection per request
  app.use(async (req, res, next) => {
    await connectDb();
    next();
  });
}

export default app;
