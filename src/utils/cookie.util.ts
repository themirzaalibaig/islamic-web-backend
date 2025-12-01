import { Response, CookieOptions as ExpressCookieOptions } from 'express';
import { env } from '@/config';

export type CookieOptions = ExpressCookieOptions;

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 24 * 60 * 60 * 1000,
};

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  res.cookie(name, value, { ...DEFAULT_COOKIE_OPTIONS, ...options });
};

export const clearCookie = (res: Response, name: string, options: CookieOptions = {}) => {
  res.clearCookie(name, { ...DEFAULT_COOKIE_OPTIONS, ...options, maxAge: 0 });
};
