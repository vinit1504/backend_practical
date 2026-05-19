import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Employee } from '../models/Employee';
import { ActivityLog } from '../models/ActivityLog';
import { MESSAGES } from '../constants/messages';

export class EmployeeController {
  static getAllEmployees = async (req: Request, res: Response) => {
    const employees = await Employee.find({});
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data: employees });
  };

  static getEmployeeById = async (req: Request, res: Response) => {
    const employee = await Employee.findOne({ employee_id: req.params.id });
    if (!employee) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: MESSAGES.ERROR.NOT_FOUND });
    }

    const activityLogs = await ActivityLog.find({ employee_id: employee.employee_id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DATA_FETCHED,
      data: { employee, activityLogs },
    });
  };
}
