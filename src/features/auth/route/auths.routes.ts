import { idempotency, validate, authenticate } from '@/middlewares';
import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshTokenController,
  signupController,
  updateUserController,
  getCurrentUserController,
  verifyEmailController,
  resendVerificationEmailController,
  forgotPasswordController,
  resetPasswordController,
  loginSchema,
  refreshTokenSchema,
  signupSchema,
  updateUserSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/features/auth';

export const authRouter = Router();

// Public routes
authRouter.post('/login', validate({ body: loginSchema }), idempotency('login'), loginController);
authRouter.post(
  '/signup',
  validate({ body: signupSchema }),
  idempotency('signup'),
  signupController,
);
authRouter.post(
  '/refresh-token',
  validate({ body: refreshTokenSchema }),
  idempotency('refreshToken'),
  refreshTokenController,
);
authRouter.post(
  '/verify-email',
  validate({ body: verifyEmailSchema }),
  idempotency('verifyEmail'),
  verifyEmailController,
);
authRouter.post(
  '/resend-verification-email',
  validate({ body: resendVerificationEmailSchema }),
  idempotency('resendVerificationEmail'),
  resendVerificationEmailController,
);
authRouter.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  idempotency('forgotPassword'),
  forgotPasswordController,
);
authRouter.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  idempotency('resetPassword'),
  resetPasswordController,
);

// Protected routes (require authentication)
authRouter.get('/me', authenticate, getCurrentUserController);
authRouter.get('/logout', authenticate, logoutController);
authRouter.put(
  '/update-user',
  authenticate,
  validate({ body: updateUserSchema }),
  idempotency('updateUser'),
  updateUserController,
);
