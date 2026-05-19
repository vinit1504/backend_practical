import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/messages';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION_FAILED,
        errors: error.errors,
      });
    }
  };
};
