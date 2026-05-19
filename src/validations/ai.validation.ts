import { z } from 'zod';

export const aiChatSchema = z.object({
  body: z.object({
    question: z.string().min(5, 'Question must be at least 5 characters long'),
  }),
});
