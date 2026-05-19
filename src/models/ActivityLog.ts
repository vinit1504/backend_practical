import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  employee_id: string;
  department: string;
  app_used: string;
  task_category: string;
  duration_minutes: number;
  timestamp: Date;
  is_repetitive: boolean;
}

const ActivityLogSchema: Schema = new Schema(
  {
    employee_id: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    app_used: { type: String, required: true, index: true },
    task_category: { type: String, required: true, index: true },
    duration_minutes: { type: Number, required: true },
    timestamp: { type: Date, required: true, index: true },
    is_repetitive: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
