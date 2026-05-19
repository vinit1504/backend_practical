import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.use(protect, authorize(UserRole.ADMIN));

router.get('/summary', asyncHandler(DashboardController.getSummary));
router.get('/departments', asyncHandler(DashboardController.getDepartmentsAnalytics));
router.get('/tasks', asyncHandler(DashboardController.getTasksAnalytics));
router.get('/apps', asyncHandler(DashboardController.getAppsAnalytics));
router.get('/trends', asyncHandler(DashboardController.getTrends));
router.get('/anomalies', asyncHandler(DashboardController.getAnomalies));

export default router;
