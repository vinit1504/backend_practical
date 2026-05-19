import app from './app';
import { config } from './config';
import { logger } from './config/logger';

// Check if running on Vercel serverless platform
const isServerless = process.env.VERCEL === '1';

if (!isServerless) {
  // Local or standard VM environment: start listening on PORT
  app.listen(config.port, () => {
    logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
  });
}

export default app;
