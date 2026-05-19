import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { generateTokens } from '../utils/jwt';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/enums';
import { config } from '../config';

export class AuthController {
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS });
    }

    if (user.role !== UserRole.ADMIN) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: MESSAGES.ERROR.FORBIDDEN });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGIN,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  };

  static logout = async (req: Request, res: Response) => {
    res.cookie('accessToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGES.SUCCESS.LOGOUT });
  };

  static refresh = async (req: Request, res: Response) => {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken && req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        refreshToken = req.headers.authorization.split(' ')[1];
      } else {
        refreshToken = req.headers.authorization;
      }
    }

    if (!refreshToken) {
      refreshToken =
        (req.headers['x-refresh-token'] as string) ||
        (req.headers['refresh-token'] as string);
    }

    if (!refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret!) as unknown as {
        id: string;
        role: UserRole;
      };

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
        decoded.id,
        decoded.role,
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
    }
  };

  static getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);
    res.status(StatusCodes.OK).json({ success: true, data: user });
  };
}
