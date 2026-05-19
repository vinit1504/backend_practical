import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/messages';
import { logger } from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.ERROR.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
