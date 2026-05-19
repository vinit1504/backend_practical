import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export class GeminiService {
  static async generateInsight(prompt: string) {
    if (!config.geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
