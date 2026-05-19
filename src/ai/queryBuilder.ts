import { ActivityLog } from '../models/ActivityLog';

export class QueryBuilder {
  static async executeIntent(intent: any) {
    const matchStage =
      Object.keys(intent.filters).length > 0 ? { $match: intent.filters } : { $match: {} };

    const [departments, apps, employees, tasks, general] = await Promise.all([
      // 1. Department Breakdown
      ActivityLog.aggregate([
        matchStage,
        {
          $group: {
            _id: '$department',
            totalDuration: { $sum: '$duration_minutes' },
            repetitiveDuration: {
              $sum: { $cond: [{ $eq: ['$is_repetitive', true] }, '$duration_minutes', 0] },
            },
          },
        },
      ]),

      // 2. App Usage Breakdown
      ActivityLog.aggregate([
        matchStage,
        {
          $group: {
            _id: '$app_used',
            totalDuration: { $sum: '$duration_minutes' },
            repetitiveDuration: {
              $sum: { $cond: [{ $eq: ['$is_repetitive', true] }, '$duration_minutes', 0] },
            },
          },
        },
        { $sort: { totalDuration: -1 } },
        { $limit: 15 },
      ]),

      // 3. Employee Performance / Logging
      ActivityLog.aggregate([
        matchStage,
        {
          $group: {
            _id: '$employee_id',
            totalDuration: { $sum: '$duration_minutes' },
            repetitiveDuration: {
              $sum: { $cond: [{ $eq: ['$is_repetitive', true] }, '$duration_minutes', 0] },
            },
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: 'employee_id',
            as: 'employeeDetails',
          },
        },
        { $unwind: { path: '$employeeDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            employee_id: '$_id',
            name: { $ifNull: ['$employeeDetails.name', 'Unknown'] },
            department: { $ifNull: ['$employeeDetails.department', 'Unknown'] },
            role: { $ifNull: ['$employeeDetails.role', 'Unknown'] },
            totalDuration: 1,
            repetitiveDuration: 1,
          },
        },
        { $sort: { totalDuration: -1 } },
        { $limit: 15 }, // Keep list manageable for token limits
      ]),

      // 4. Task Categories
      ActivityLog.aggregate([
        matchStage,
        {
          $group: {
            _id: '$task_category',
            totalDuration: { $sum: '$duration_minutes' },
            isRepetitive: { $first: '$is_repetitive' },
          },
        },
        { $sort: { totalDuration: -1 } },
      ]),

      // 5. General / Overview Stats
      ActivityLog.aggregate([
        matchStage,
        {
          $group: {
            _id: null,
            totalDuration: { $sum: '$duration_minutes' },
            totalRecords: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      overview: general[0] || { totalDuration: 0, totalRecords: 0 },
      departments,
      apps,
      employees,
      tasks,
    };
  }
}
