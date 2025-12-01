import { LoginDto, SignupDto, UpdateUserDto, UserModel } from '@/features/auth';
import { AppError, createCachedRepository, createValidationError, generateTokens } from '@/utils';

const repo = createCachedRepository(UserModel, 'user');

export const signup = async (signupDto: SignupDto) => {
  const user = await repo.create(signupDto);
  return user;
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
