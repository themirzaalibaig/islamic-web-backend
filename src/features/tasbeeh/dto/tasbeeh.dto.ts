import { z } from 'zod';
import {
  createTasbeehSchema,
  updateTasbeehSchema,
  tasbeehIdParamsSchema,
  listTasbeehsQuerySchema,
} from '@/features/tasbeeh/validation/tasbeeh.validations';

export type CreateTasbeehDto = z.infer<typeof createTasbeehSchema>;
export type UpdateTasbeehDto = z.infer<typeof updateTasbeehSchema>;
export type TasbeehIdParams = z.infer<typeof tasbeehIdParamsSchema>;
export type ListTasbeehsQueryDto = z.infer<typeof listTasbeehsQuerySchema>;
