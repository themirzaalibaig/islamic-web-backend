import { z } from 'zod';
import { commonSchemas, querySchema } from '@/validations';

export const createConversationSchema = z.object({
  title: z.string().max(200, 'Title cannot exceed 200 characters').trim().optional(),
});

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
});

export const conversationIdParamsSchema = z.object({
  id: commonSchemas.objectId,
});

export const listConversationsQuerySchema = querySchema.extend({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
});
