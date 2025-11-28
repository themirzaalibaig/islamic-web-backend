import z from 'zod';
import { Test } from '@/features/test';
import { listTestsQuerySchema } from '@/validations';

export interface CreateTestDto extends Omit<Test, '_id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateTestDto extends Partial<CreateTestDto> {}

export interface GetAllTestsDto extends z.infer<typeof listTestsQuerySchema> {}
