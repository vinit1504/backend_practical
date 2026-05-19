import { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.get('/pdf', protect, authorize(UserRole.ADMIN), asyncHandler(ExportController.exportPdf));

export default router;
