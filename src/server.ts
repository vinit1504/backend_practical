import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB successfully');

    app.listen(config.port, () => {
      logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
};

startServer();
