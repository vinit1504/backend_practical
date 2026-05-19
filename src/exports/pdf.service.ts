import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { AnalyticsService } from '../analytics/analytics.service';

export class PdfExportService {
  static async generateExecutiveSummary(res: Response) {
    const data = await AnalyticsService.getSummary();

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Executive_Summary.pdf"');

    doc.pipe(res);

    doc.fontSize(20).text('Workforce Pulse - Executive Summary', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Recoverable Hours: ${data.recoverable_hours.toFixed(2)}`);
    doc.text(`Recoverable INR: ₹${data.recoverable_inr.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(16).text('Top Tasks:');
    data.top_tasks.forEach((t: any, index: number) => {
      doc.fontSize(12).text(`${index + 1}. ${t.task} (${t.count})`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Top Departments:');
    data.top_departments.forEach((d: any, index: number) => {
      doc.fontSize(12).text(`${index + 1}. ${d.department} (${d.count})`);
    });

    doc.end();
  }
}
