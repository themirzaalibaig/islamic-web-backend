import { z } from 'zod';
import { commonSchemas, querySchema } from '@/validations';

export const createTestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: commonSchemas.email,
});

export const updateTestSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: commonSchemas.email.optional(),
});

export const testIdParamsSchema = z.object({
  id: commonSchemas.objectId,
});

export const listTestsQuerySchema = querySchema;
