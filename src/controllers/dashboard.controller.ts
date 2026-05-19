import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnalyticsService } from '../analytics/analytics.service';
import { MESSAGES } from '../constants/messages';

export class DashboardController {
  static getSummary = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getSummary();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };

  static getDepartmentsAnalytics = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getDepartmentsAnalytics();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };

  static getTasksAnalytics = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getTasksAnalytics();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };

  static getAppsAnalytics = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getAppsAnalytics();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };

  static getTrends = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getTrends();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };

  static getAnomalies = async (req: Request, res: Response) => {
    const data = await AnalyticsService.getAnomalies();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGES.SUCCESS.DATA_FETCHED, data });
  };
}
