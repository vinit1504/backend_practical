import app from './app';
import { logger } from './config/logger';

// Vercel adapter: delegate request to Express app and capture unexpected errors.
// Use `any` for handler params to avoid requiring `@vercel/node` types at build time.
export default async function handler(req: any, res: any) {
  try {
    return app(req as any, res as any);
  } catch (err: any) {
    logger.error('Vercel function handler error:', err?.stack || err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
