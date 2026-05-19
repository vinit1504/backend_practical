import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.post(
  '/files',
  protect,
  authorize(UserRole.ADMIN),
  upload.array('files', 2), // Expecting 2 files (csv and json)
  asyncHandler(UploadController.uploadFiles),
);

export default router;
