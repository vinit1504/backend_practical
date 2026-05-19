import { ActivityLog } from '../models/ActivityLog';

export class AnalyticsService {
  static async getSummary() {
    const summary = await ActivityLog.aggregate([
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration_minutes' },
          recoverableMinutes: {
            $sum: { $cond: [{ $eq: ['$is_repetitive', true] }, '$duration_minutes', 0] },
          },
        },
      },
    ]);

    // Additional logic to calculate INR would join with employees
    const recoverable_hours = summary.length ? summary[0].recoverableMinutes / 60 : 0;

    // For INR calculation, we need average salary or exact mapping
    // Simplified assumption:
    const recoverable_inr = recoverable_hours * 500; // Mock calculation, to be refined based on actual employee compensation

    const topTasks = await ActivityLog.aggregate([
      { $group: { _id: '$task_category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { task: '$_id', count: 1, _id: 0 } },
    ]);

    const topDepartments = await ActivityLog.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { department: '$_id', count: 1, _id: 0 } },
    ]);

    return {
      recoverable_hours,
      recoverable_inr,
      top_tasks: topTasks,
      top_departments: topDepartments,
    };
  }

  static async getDepartmentsAnalytics() {
    return ActivityLog.aggregate([
      {
        $group: {
          _id: '$department',
          total_duration: { $sum: '$duration_minutes' },
          tasks: { $addToSet: '$task_category' },
        },
      },
      {
        $project: {
          department: '$_id',
          total_duration: 1,
          task_count: { $size: '$tasks' },
          _id: 0,
        },
      },
    ]);
  }

  static async getTasksAnalytics() {
    return ActivityLog.aggregate([
      {
        $group: {
          _id: '$task_category',
          total_duration: { $sum: '$duration_minutes' },
          repetitive_duration: {
            $sum: { $cond: [{ $eq: ['$is_repetitive', true] }, '$duration_minutes', 0] },
          },
        },
      },
      { $project: { task: '$_id', total_duration: 1, repetitive_duration: 1, _id: 0 } },
    ]);
  }

  static async getAppsAnalytics() {
    return ActivityLog.aggregate([
      { $group: { _id: '$app_used', total_duration: { $sum: '$duration_minutes' } } },
      { $sort: { total_duration: -1 } },
      { $project: { app: '$_id', total_duration: 1, _id: 0 } },
    ]);
  }

  static async getAnomalies() {
    // Example anomaly: Duration > 10 hours in a single log
    return ActivityLog.find({ duration_minutes: { $gt: 600 } }).limit(10);
  }

  static async getTrends() {
    return ActivityLog.aggregate([
      {
        $group: {
          _id: { year: { $year: '$timestamp' }, week: { $isoWeek: '$timestamp' } },
          total_duration: { $sum: '$duration_minutes' },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);
  }
}
