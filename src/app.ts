import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { config } from './config';
import { logger } from './config/logger';

// Routes
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import dashboardRoutes from './routes/dashboard.routes';
import employeeRoutes from './routes/employee.routes';
import aiRoutes from './routes/ai.routes';
import exportRoutes from './routes/export.routes';

// Middleware
import { errorHandler } from './middleware/error.middleware';

const app = express();

let isConnected = false;

// ========================
// MongoDB Connection
// ========================

export const connectDb = async () => {
  try {
    // Already connected
    if (isConnected && mongoose.connection.readyState === 1) {
      return;
    }

    if (!config.mongoUri) {
      throw new Error('Mongo URI is missing');
    }

    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

// ========================
// Middleware
// ========================

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(mongoSanitize());

// ========================
// Rate Limiter
// ========================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use('/api', limiter);

// ========================
// Logger
// ========================

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// ========================
// Health Check
// ========================

app.get('/api/health', async (_req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      uptime: process.uptime(),
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
    });
  }
});

// ========================
// Routes
// ========================

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

// ========================
// Error Middleware
// ========================

app.use(errorHandler);

export default app;
