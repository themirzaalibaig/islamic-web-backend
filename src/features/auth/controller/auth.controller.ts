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
} from '@/features/auth';
import { TypedRequest } from '@/types';
import { createValidationError, Res, setCookie, clearCookie, getTokenExpiration } from '@/utils';
import { IdParams } from '@/dto';

export const SignupController = async (req: TypedRequest<unknown, SignupDto>, res: Response) => {
  try {
    const user = await signup(req.body);
    return Res.created(res, { user }, 'User created successfully');
  } catch (error: any) {
    if (error.code === 11000) {
      const validationError = createValidationError(
        'email',
        'Email already exists',
        req.body.email,
      );
      return Res.conflict(res, 'Email already exists', [validationError]);
    }
    return Res.internalError(res, 'Internal server error', error);
  }
};

export const LoginController = async (req: TypedRequest<unknown, LoginDto>, res: Response) => {
  try {
    const { user, token } = await login(req.body);
    setCookie(res, 'accessToken', token.accessToken, {
      maxAge: getTokenExpiration(token.accessToken)!,
    });
    setCookie(res, 'refreshToken', token.refreshToken, {
      maxAge: getTokenExpiration(token.refreshToken)!,
    });
    return Res.success(res, { user, token: token.accessToken }, 'Login successful');
  } catch (error: any) {
    return Res.internalError(res, 'Internal server error', error);
  }
};

export const RefreshTokenController = async (
  req: TypedRequest<unknown, RefreshTokenDto>,
  res: Response,
) => {
  try {
    const { user, token } = await refreshToken(req.body.refreshToken);
    setCookie(res, 'accessToken', token.accessToken, {
      maxAge: getTokenExpiration(token.accessToken)!,
    });
    setCookie(res, 'refreshToken', token.refreshToken, {
      maxAge: getTokenExpiration(token.refreshToken)!,
    });
    return Res.success(res, { user, token: token.accessToken }, 'Refresh token successful');
  } catch (error: any) {
    return Res.internalError(res, 'Internal server error', error);
  }
};

export const LogoutController = async (req: TypedRequest, res: Response) => {
  try {
    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');
    return Res.success(res, {}, 'Logout successful');
  } catch (error: any) {
    return Res.internalError(res, 'Internal server error', error);
  }
};

export const updateUserController = async (
  req: TypedRequest<unknown, UpdateUserDto, IdParams>,
  res: Response,
) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return Res.success(res, { user }, 'User updated successfully');
  } catch (error: any) {
    return Res.internalError(res, 'Internal server error', error);
  }
};
