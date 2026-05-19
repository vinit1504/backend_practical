import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsSummary extends Document {
  date: Date;
  recoverable_hours: number;
  recoverable_inr: number;
  top_tasks: Array<{ task: string; count: number }>;
  top_departments: Array<{ department: string; count: number }>;
}

const AnalyticsSummarySchema: Schema = new Schema(
  {
    date: { type: Date, required: true, unique: true, index: true },
    recoverable_hours: { type: Number, required: true, default: 0 },
    recoverable_inr: { type: Number, required: true, default: 0 },
    top_tasks: [
      {
        task: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    top_departments: [
      {
        department: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const AnalyticsSummary = mongoose.model<IAnalyticsSummary>(
  'AnalyticsSummary',
  AnalyticsSummarySchema,
);
