import mongoose, { Document, Schema } from 'mongoose';
import { EmployeeStatus, CompensationType } from '../constants/enums';

export interface IEmployee extends Document {
  employee_id: string;
  name: string;
  department: string;
  role: string;
  compensation: number;
  compensation_type: CompensationType;
  working_hours: number;
  status: EmployeeStatus;
  tenure_months: number;
}

const EmployeeSchema: Schema = new Schema(
  {
    employee_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    department: { type: String, required: true, index: true },
    role: { type: String, required: true },
    compensation: { type: Number, required: true },
    compensation_type: { type: String, enum: Object.values(CompensationType), required: true },
    working_hours: { type: Number, required: true },
    status: { type: String, enum: Object.values(EmployeeStatus), default: EmployeeStatus.ACTIVE },
    tenure_months: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
