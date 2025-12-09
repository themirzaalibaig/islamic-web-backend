import { Response } from 'express';
import {
  LoginDto,
  login,
  signup,
  SignupDto,
  refreshToken,
  RefreshTokenDto,
  UpdateUserDto,
  updateUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  VerifyEmailDto,
  ResendVerificationEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@/features/auth';
import { TypedRequest } from '@/types';
import {
  Res,
  setCookie,
  clearCookie,
  getTokenExpiration,
  catchAsync,
  getCurrentUser,
} from '@/utils';
import { AuthenticatedRequest } from '@/middlewares';

export const signupController = catchAsync(
  async (req: TypedRequest<unknown, SignupDto>, res: Response) => {
    const result = await signup(req.body);
    return Res.created(res, result, 'Please verify your email.');
  },
);

export const verifyEmailController = catchAsync(
  async (req: TypedRequest<unknown, VerifyEmailDto>, res: Response) => {
    const { email, otp } = req.body;
    const user = await verifyEmail(email, otp);
    return Res.success(res, { user }, 'Email verified successfully');
  },
);

export const resendVerificationEmailController = catchAsync(
  async (req: TypedRequest<unknown, ResendVerificationEmailDto>, res: Response) => {
    const { email } = req.body;
    const result = await resendVerificationEmail(email);
    return Res.success(res, result, 'Verification email sent successfully');
  },
);

export const forgotPasswordController = catchAsync(
  async (req: TypedRequest<unknown, ForgotPasswordDto>, res: Response) => {
    const { email } = req.body;
    const result = await forgotPassword(email);
    return Res.success(res, result, 'Password reset email sent successfully');
  },
);

export const resetPasswordController = catchAsync(
  async (req: TypedRequest<unknown, ResetPasswordDto>, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPassword(email, otp, newPassword);
    return Res.success(res, result, 'Password reset successfully');
  },
);

export const loginController = catchAsync(
  async (req: TypedRequest<unknown, LoginDto>, res: Response) => {
    const { user, token } = await login(req.body);
    setCookie(res, 'accessToken', token.accessToken, {
      maxAge: getTokenExpiration(token.accessToken)!,
    });
    setCookie(res, 'refreshToken', token.refreshToken, {
      maxAge: getTokenExpiration(token.refreshToken)!,
    });
    return Res.success(res, { user, token: token }, 'Login successful');
  },
);

export const refreshTokenController = catchAsync(
  async (req: TypedRequest<unknown, RefreshTokenDto>, res: Response) => {
    const { user, token } = await refreshToken(req.body.refreshToken);
    setCookie(res, 'accessToken', token.accessToken, {
      maxAge: getTokenExpiration(token.accessToken)!,
    });
    setCookie(res, 'refreshToken', token.refreshToken, {
      maxAge: getTokenExpiration(token.refreshToken)!,
    });
    return Res.success(res, { user, token: token }, 'Refresh token successful');
  },
);

export const logoutController = catchAsync(async (req: TypedRequest, res: Response) => {
  clearCookie(res, 'accessToken');
  clearCookie(res, 'refreshToken');
  return Res.success(res, {}, 'Logout successful');
});

export const updateUserController = catchAsync(
  async (req: AuthenticatedRequest<unknown, UpdateUserDto>, res: Response) => {
    const currentUser = getCurrentUser(req);
    const user = await updateUser(currentUser._id, req.body);
    return Res.success(res, { user }, 'User updated successfully');
  },
);

export const getCurrentUserController = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getCurrentUser(req);
    return Res.success(res, { user }, 'User retrieved successfully');
  },
);
