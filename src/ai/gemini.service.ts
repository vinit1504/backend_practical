import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

export class GeminiService {
  private static client: any;

  private static getClient() {
    if (!this.client) {
      if (!config.geminiApiKey) {
        throw new Error('Gemini API key is not configured');
      }
      this.client = new GoogleGenerativeAI(config.geminiApiKey);
    }
    return this.client;
  }

  static async generateInsight(prompt: string) {
    const genAI = this.getClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
