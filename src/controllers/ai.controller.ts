import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IntentParser } from '../ai/intentParser';
import { QueryBuilder } from '../ai/queryBuilder';
import { getAnalyticsPrompt } from '../ai/analyticsPrompt';
import { GeminiService } from '../ai/gemini.service';

export class AiController {
  static chat = async (req: Request, res: Response) => {
    const { question } = req.body;

    // 1. Intent Parser
    const intent = IntentParser.parse(question);

    // 2. Query Builder & execution
    const data = await QueryBuilder.executeIntent(intent);

    // 3. Prompt generation
    const prompt = getAnalyticsPrompt(question, data);

    // 4. Gemini completion
    const insight = await GeminiService.generateInsight(prompt);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        intent,
        insight,
      },
    });
  };
}
