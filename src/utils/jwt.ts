import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../constants/enums';

export const generateTokens = (id: string, role: UserRole) => {
  const accessToken = jwt.sign({ id, role }, config.jwtSecret!, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id, role }, config.jwtRefreshSecret!, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};
