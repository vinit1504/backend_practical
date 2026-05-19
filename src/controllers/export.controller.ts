import { Request, Response } from 'express';
import { PdfExportService } from '../exports/pdf.service';

export class ExportController {
  static exportPdf = async (req: Request, res: Response) => {
    await PdfExportService.generateExecutiveSummary(res);
  };
}
