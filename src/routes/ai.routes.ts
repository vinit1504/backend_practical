import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { aiChatSchema } from '../validations/ai.validation';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.post(
  '/chat',
  protect,
  authorize(UserRole.ADMIN),
  validateRequest(aiChatSchema),
  asyncHandler(AiController.chat),
);

export default router;
