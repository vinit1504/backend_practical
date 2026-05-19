export class CleaningService {
  static normalizeAppName(appName: string): string {
    if (!appName) return 'Unknown';
    const name = appName.trim().toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  static normalizeTaskCategory(category: string): string {
    return category ? category.trim() : 'Uncategorized';
  }

  static normalizeBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.trim().toLowerCase();
      return lower === 'true' || lower === 'yes' || lower === '1';
    }
    return Boolean(value);
  }

  static normalizeTimestamp(timestamp: string | Date): Date {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return new Date(); // fallback
    return date;
  }

  static validateDuration(duration: any): number {
    const num = Number(duration);
    return isNaN(num) || num < 0 ? 0 : num;
  }

  static cleanString(value: string): string {
    return value ? value.trim() : '';
  }

  static normalizeEmployeeSchema(employee: any) {
    const id = this.cleanString(employee.employee_id || employee.EmployeeID || employee.id);
    const name = this.cleanString(employee.name || employee.Name);
    const department = this.cleanString(employee.department || employee.Dept);
    const role = this.cleanString(employee.role || employee.Role || employee.meta?.role);

    // Compensation parsing
    let compensation = 0;
    let compensation_type = 'salary';

    if (employee.hourly_rate_inr !== undefined && employee.hourly_rate_inr !== null) {
      compensation = Number(employee.hourly_rate_inr) || 0;
      compensation_type = 'hourly';
    } else if (employee.salary_LPA !== undefined && employee.salary_LPA !== null) {
      compensation = (Number(employee.salary_LPA) || 0) * 100000;
      compensation_type = 'salary';
    } else if (employee.annual_ctc_inr !== undefined && employee.annual_ctc_inr !== null) {
      compensation = Number(employee.annual_ctc_inr) || 0;
      compensation_type = 'salary';
    } else if (
      employee.meta?.compensation?.annual !== undefined &&
      employee.meta?.compensation?.annual !== null
    ) {
      compensation = Number(employee.meta.compensation.annual) || 0;
      compensation_type = 'salary';
    }

    // Working Hours parsing
    let working_hours = 8;
    const hoursRaw =
      employee.working_hours || employee.workingHours || employee.meta?.working_hours;

    if (hoursRaw) {
      if (typeof hoursRaw === 'number') {
        working_hours = hoursRaw;
      } else if (typeof hoursRaw === 'string') {
        const parts = hoursRaw.split('-');
        if (parts.length === 2) {
          const start = parseFloat(parts[0].replace(':', '.'));
          const end = parseFloat(parts[1].replace(':', '.'));
          if (!isNaN(start) && !isNaN(end)) {
            working_hours = end - start;
          }
        }
      } else if (typeof hoursRaw === 'object' && hoursRaw.start && hoursRaw.end) {
        const start = parseFloat(hoursRaw.start.replace(':', '.'));
        const end = parseFloat(hoursRaw.end.replace(':', '.'));
        if (!isNaN(start) && !isNaN(end)) {
          working_hours = end - start;
        }
      }
    }

    // Status mapping
    let status = this.cleanString(employee.status || employee.Status).toLowerCase();
    if (status === 'terminated') {
      status = 'inactive';
    }
    if (!['active', 'inactive', 'on_leave'].includes(status)) {
      status = 'active'; // fallback
    }

    const tenure_months =
      Number(employee.tenure_months || employee.tenureMonths || employee.meta?.tenure_months) || 0;

    return {
      employee_id: id,
      name,
      department,
      role,
      compensation,
      compensation_type,
      working_hours,
      status,
      tenure_months,
    };
  }

  static removeDuplicateLogs(logs: any[]) {
    const seen = new Set();
    return logs.filter((log) => {
      const key = `${log.employee_id}-${log.timestamp}-${log.app_used}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  static handleDuplicateEmployees(employees: any[]) {
    const unique = new Map();
    for (const emp of employees) {
      if (emp.employee_id) unique.set(emp.employee_id, emp);
    }
    return Array.from(unique.values());
  }
}
