import { LoginDto, SignupDto, UpdateUserDto, UserModel } from '@/features/auth';
import { AppError, createCachedRepository, createValidationError, generateTokens, addEmailJob, getVerificationEmailTemplate, getWelcomeEmailTemplate, getForgotPasswordEmailTemplate, hashPassword } from '@/utils';
import crypto from 'crypto';

const repo = createCachedRepository(UserModel, 'user');

export const signup = async (signupDto: SignupDto) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await repo.create({
    ...signupDto,
    code: { otp, expiresAt },
  });

  await addEmailJob('verification', {
    to: user.email,
    subject: 'Verify your email',
    html: getVerificationEmailTemplate(otp),
  });

  return { message: 'Please verify your email.' };
};

export const verifyEmail = async (email: string, otp: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('User already verified', 400);
  }

  if (user.code?.otp !== otp || (user.code.expiresAt && user.code.expiresAt < new Date())) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  user.isVerified = true;
  user.code = undefined;
  await user.save();

  await addEmailJob('welcome', {
    to: user.email,
    subject: 'Welcome to Islamic Web',
    html: getWelcomeEmailTemplate(user.username),
  });

  return user;
};

export const resendVerificationEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('User already verified', 400);
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.code = { otp, expiresAt };
  await user.save();

  await addEmailJob('verification', {
    to: user.email,
    subject: 'Verify your email',
    html: getVerificationEmailTemplate(otp),
  });

  return { message: 'Verification email sent' };
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.code = { otp, expiresAt };
  await user.save();

  await addEmailJob('forgot-password', {
    to: user.email,
    subject: 'Reset your password',
    html: getForgotPasswordEmailTemplate(otp),
  });

  return { message: 'Password reset email sent' };
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.code?.otp !== otp || (user.code.expiresAt && user.code.expiresAt < new Date())) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  user.password = newPassword; // Will be hashed by pre-save hook
  user.code = undefined;
  await user.save();

  return { message: 'Password reset successfully' };
};

export const login = async (loginDto: LoginDto) => {
  const { email, password } = loginDto;
  const user = await UserModel.findOne({ email });
  let validationError;
  if (!user) {
    validationError = createValidationError('email', 'User not found', email);
    throw new AppError('User not found', 404, [validationError]);
  }
  if (!user.isVerified) {
    validationError = createValidationError('email', 'User not verified', email);
    throw new AppError('User not verified', 401, [validationError]);
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    validationError = createValidationError('password', 'Invalid password', password);
    throw new AppError('Invalid password', 401, [validationError]);
  }
  const token = generateTokens({ id: user._id, role: user.role });
  user.token = token.refreshToken;
  await user.save();
  user.password = undefined;
  user.token = undefined;
  return { user, token };
};

export const logout = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.token = undefined;
  await user.save();
  return user;
};

export const refreshToken = async (refreshToken: string) => {
  const user = await UserModel.findOne({ token: refreshToken });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const token = generateTokens({ id: user._id, role: user.role });
  user.token = token.refreshToken;
  await user.save();
  return { user, token };
};

export const updateUser = async (userId: string, updateDto: UpdateUserDto) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.set(updateDto);
  await user.save();
  return user;
};
