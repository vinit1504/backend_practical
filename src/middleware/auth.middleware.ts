import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/enums';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.accessToken;

  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers.authorization;
    }
  }

  if (!token) {
    token = (req.headers['x-access-token'] as string) || (req.headers['token'] as string);
  }

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret!) as unknown as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: MESSAGES.ERROR.FORBIDDEN });
    }
    next();
  };
};
