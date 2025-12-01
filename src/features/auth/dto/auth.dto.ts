import z from 'zod';
import { loginSchema, signupSchema, refreshTokenSchema, updateUserSchema } from '@/features/auth';

export type LoginDto = z.infer<typeof loginSchema>;

export type SignupDto = z.infer<typeof signupSchema>;

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
