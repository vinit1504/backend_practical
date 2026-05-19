import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserRole } from '../constants/enums';

const router = Router();

router.use(protect, authorize(UserRole.ADMIN));

router.get('/', asyncHandler(EmployeeController.getAllEmployees));
router.get('/:id', asyncHandler(EmployeeController.getEmployeeById));

export default router;
