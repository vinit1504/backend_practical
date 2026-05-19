import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/workforce_pulse',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyB5suXBTMZsQAoelix7FlXrYeb7UT10GHk',
  nodeEnv: process.env.NODE_ENV || 'development',
};
