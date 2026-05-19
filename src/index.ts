import app, { connectDb } from './app';
import { logger } from './config/logger';

// Cold-start DB initialization state
let initState: 'idle' | 'pending' | 'ready' | 'failed' = 'idle';
let initPromise: Promise<void> | null = null;

const withTimeout = <T>(p: Promise<T>, ms: number) => {
  const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
  return Promise.race([p, timeout]);
};

async function ensureDbReady() {
  if (initState === 'ready') return;
  if (initState === 'pending' && initPromise) return initPromise;

  initState = 'pending';
  initPromise = (async () => {
    try {
      await withTimeout(connectDb(), 5000);
      initState = 'ready';
    } catch (err: any) {
      initState = 'failed';
      logger.error('Cold-start DB initialization failed:', err?.stack || err);
      throw err;
    }
  })();

  return initPromise;
}

// Vercel adapter: delegate request to Express app and capture unexpected errors.
// Use `any` for handler params to avoid requiring `@vercel/node` types at build time.
export default async function handler(req: any, res: any) {
  try {
    // Attempt DB init on first request (with timeout). If it fails, return 503.
    if (initState !== 'ready') {
      try {
        await ensureDbReady();
      } catch (err) {
        return res.status(503).json({ success: false, message: 'Service temporarily unavailable' });
      }
    }

    return app(req as any, res as any);
  } catch (err: any) {
    logger.error('Vercel function handler error:', err?.stack || err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
