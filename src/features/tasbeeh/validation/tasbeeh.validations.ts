import { z } from 'zod';
import { commonSchemas, querySchema } from '@/validations';

export const createTasbeehSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim(),
  text: z.string().min(1, 'Text is required').max(500, 'Text cannot exceed 500 characters').trim(),
  target: z
    .number()
    .int('Target must be an integer')
    .min(1, 'Target must be at least 1')
    .max(1000000, 'Target cannot exceed 1000000'),
});

export const updateTasbeehSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  text: z
    .string()
    .min(1, 'Text is required')
    .max(500, 'Text cannot exceed 500 characters')
    .trim()
    .optional(),
  target: z
    .number()
    .int('Target must be an integer')
    .min(1, 'Target must be at least 1')
    .max(1000000, 'Target cannot exceed 1000000')
    .optional(),
  isActive: z.boolean().optional(),
});

export const tasbeehIdParamsSchema = z.object({
  id: commonSchemas.objectId,
});

export const listTasbeehsQuerySchema = querySchema;
