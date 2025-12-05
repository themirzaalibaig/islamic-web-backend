import z from 'zod';
import { loginSchema, signupSchema, refreshTokenSchema, updateUserSchema, verifyEmailSchema, resendVerificationEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '@/features/auth';

export type LoginDto = z.infer<typeof loginSchema>;

export type SignupDto = z.infer<typeof signupSchema>;

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

export type ResendVerificationEmailDto = z.infer<typeof resendVerificationEmailSchema>;

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
