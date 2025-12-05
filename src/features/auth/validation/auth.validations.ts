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
});

export const verifyEmailSchema = z.object({
  email: commonSchemas.email,
  otp: z.string().length(6),
});

export const resendVerificationEmailSchema = z.object({
  email: commonSchemas.email,
});

export const forgotPasswordSchema = z.object({
  email: commonSchemas.email,
});

export const resetPasswordSchema = z.object({
  email: commonSchemas.email,
  otp: z.string().length(6),
  newPassword: commonSchemas.password,
});
