import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema } from '../validations/auth.validation';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.post('/login', validateRequest(loginSchema), asyncHandler(AuthController.login));
router.post('/logout', protect, asyncHandler(AuthController.logout));
router.post('/refresh', asyncHandler(AuthController.refresh));
router.get('/me', protect, authorize(UserRole.ADMIN), asyncHandler(AuthController.getMe));

export default router;
