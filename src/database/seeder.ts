import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { UserRole } from '../constants/enums';
import { logger } from '../config/logger';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/workforce_pulse';
    await mongoose.connect(mongoUri);
    logger.info('Connected to database for seeding...');

    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users.');

    // Add admin user
    await User.create({
      email: 'admin@workforcepulse.com',
      password: 'password123',
      role: UserRole.ADMIN,
    });
    logger.info(
      'Admin user seeded successfully. [email: admin@workforcepulse.com, password: password123]',
    );

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database', error);
    process.exit(1);
  }
};

seedDatabase();
