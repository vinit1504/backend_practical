import app, { connectDb } from './app';
import { config } from './config';
import { logger } from './config/logger';

// ========================
// Local Development
// ========================

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  connectDb()
    .then(() => {
      app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      });
    })
    .catch((error) => {
      logger.error('Server startup failed:', error);
    });
}

// ========================
// Vercel Serverless Handler
// ========================

export default async function handler(req: any, res: any) {
  try {
    await connectDb();

    return app(req, res);
  } catch (error) {
    logger.error('Vercel function error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
