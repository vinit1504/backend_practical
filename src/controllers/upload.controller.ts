import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/messages';
import { parseCSV } from '../parsers/csvParser';
import { parseJSON } from '../parsers/jsonParser';
import { DataJoiningService } from '../services/dataJoining.service';
import { Employee } from '../models/Employee';
import { ActivityLog } from '../models/ActivityLog';
import fs from 'fs/promises';

export class UploadController {
  static uploadFiles = async (req: Request, res: Response) => {
    console.log('--- Upload Request ---');
    console.log('req.files length:', req.files?.length);
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.log('Fail 1: req.files is empty or invalid');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.ERROR.MISSING_FILES });
    }

    const files = req.files as Express.Multer.File[];
    let employeesData: any[] = [];
    let activityLogsData: any[] = [];

    try {
      for (const file of files) {
        console.log(`Processing: ${file.originalname} (mimetype: ${file.mimetype})`);
        if (file.originalname.toLowerCase().endsWith('.json')) {
          employeesData = await parseJSON(file.path);
          console.log(`JSON parsed: ${employeesData.length} records`);
        } else if (file.originalname.toLowerCase().endsWith('.csv')) {
          activityLogsData = await parseCSV(file.path);
          console.log(`CSV parsed: ${activityLogsData.length} records`);
        }
      }

      if (!employeesData.length || !activityLogsData.length) {
        console.log(
          `Fail 2: employeesData=${employeesData.length}, activityLogsData=${activityLogsData.length}`,
        );
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.ERROR.MISSING_FILES });
      }

      const { validEmployees, validLogs } = DataJoiningService.processAndJoin(
        employeesData,
        activityLogsData,
      );

      // Save to database
      await Employee.deleteMany({});
      await Employee.insertMany(validEmployees);

      await ActivityLog.deleteMany({});
      await ActivityLog.insertMany(validLogs);

      // Clean up uploaded files
      await Promise.all(files.map((file) => fs.unlink(file.path)));

      res.status(StatusCodes.OK).json({ success: true, message: MESSAGES.SUCCESS.FILES_UPLOADED });
    } catch (error) {
      // Clean up uploaded files in case of error
      await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => null)));
      throw error;
    }
  };
}
