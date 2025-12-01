import { commonSchemas } from '@/validations';
import z from 'zod';

export const loginSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export const signupSchema = z.object({
  username: commonSchemas.username,
  email: commonSchemas.email,
  password: commonSchemas.password,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const updateUserSchema = z.object({
  username: commonSchemas.username.optional(),
  fiqh: z.string().optional(),
  refType: z.string().optional(),
  refId: z.string().optional(),
});
