import { CleaningService } from './cleaning.service';

export class DataJoiningService {
  static processAndJoin(employeesData: any[], activityLogsData: any[]) {
    // 1. Clean and normalize employees
    let cleanedEmployees = employeesData.map((e) => CleaningService.normalizeEmployeeSchema(e));
    cleanedEmployees = CleaningService.handleDuplicateEmployees(cleanedEmployees);
    cleanedEmployees = cleanedEmployees.filter((e) => e.employee_id); // Remove missing IDs

    const employeeMap = new Map();
    cleanedEmployees.forEach((e) => employeeMap.set(e.employee_id, e));

    // 2. Clean and normalize logs
    let cleanedLogs = activityLogsData.map((log) => ({
      employee_id: CleaningService.cleanString(log.employee_id),
      department: CleaningService.cleanString(log.department),
      app_used: CleaningService.normalizeAppName(log.app_used),
      task_category: CleaningService.normalizeTaskCategory(log.task_category),
      duration_minutes: CleaningService.validateDuration(log.duration_minutes),
      timestamp: CleaningService.normalizeTimestamp(log.timestamp),
      is_repetitive: CleaningService.normalizeBoolean(log.is_repetitive),
    }));

    cleanedLogs = CleaningService.removeDuplicateLogs(cleanedLogs);

    // 3. Filter orphan logs (logs without valid employee)
    cleanedLogs = cleanedLogs.filter((log) => employeeMap.has(log.employee_id));

    return { validEmployees: cleanedEmployees, validLogs: cleanedLogs };
  }
}
