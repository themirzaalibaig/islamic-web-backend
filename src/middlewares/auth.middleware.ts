import { NextFunction, Response } from 'express';
import { AppError, verifyToken, logger } from '@/utils';
import { UserModel } from '@/features/auth';
import { TypedRequest } from '@/types';
import { UserRole } from '@/enums';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Extended Request interface with user property
 */
export interface AuthenticatedRequest<Q = unknown, B = unknown, P = unknown>
  extends TypedRequest<Q, B, P> {
  user?: {
    _id: string;
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    fiqh?: string;
    isVerified: boolean;
  };
}

/**
 * Authentication Middleware
 * Verifies JWT token from cookies and attaches user to request
 *
 * Usage:
 * router.get('/protected', authenticate, controller);
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get access token from cookies
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw AppError.unauthorized('Authentication required. Please login.');
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(accessToken) as JwtPayload;
    } catch (error: any) {
      logger.warn({ error: error.message }, 'Token verification failed');
      throw AppError.unauthorized('Invalid or expired token. Please login again.');
    }

    // Extract user ID from token payload
    const userId = decoded.id || decoded._id;
    if (!userId) {
      throw AppError.unauthorized('Invalid token payload.');
    }

    // Fetch user from database
    const user = await UserModel.findById(userId).select('-password -token -code');
    if (!user) {
      throw AppError.unauthorized('User not found. Please login again.');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw AppError.unauthorized('Please verify your email before accessing this resource.');
    }

    // Attach user to request object
    req.user = {
      _id: user._id.toString(),
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      fiqh: user.fiqh,
      isVerified: user.isVerified,
    };

    logger.debug({ userId: user._id, email: user.email }, 'User authenticated');
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error({ error }, 'Authentication middleware error');
      next(AppError.unauthorized('Authentication failed.'));
    }
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token exists, but doesn't require authentication
 *
 * Usage:
 * router.get('/public', optionalAuth, controller);
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return next();
    }

    try {
      const decoded = verifyToken(accessToken) as JwtPayload;
      const userId = decoded.id || decoded._id;

      if (userId) {
        const user = await UserModel.findById(userId).select('-password -token -code');
        if (user && user.isVerified) {
          req.user = {
            _id: user._id.toString(),
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            fiqh: user.fiqh,
            isVerified: user.isVerified,
          };
        }
      }
    } catch (error) {
      // Silently fail for optional auth
      logger.debug({ error }, 'Optional auth failed - continuing without user');
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Role-based Authorization Middleware
 * Requires user to have a specific role
 *
 * Usage:
 * router.get('/admin-only', authenticate, authorize(UserRole.ADMIN), controller);
 */
export const authorize =
  (...allowedRoles: UserRole[]) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role as UserRole)) {
        throw AppError.forbidden(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        logger.error({ error }, 'Authorization middleware error');
        next(AppError.forbidden('Access denied'));
      }
    }
  };

