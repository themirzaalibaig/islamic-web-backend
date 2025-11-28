import nodemailer from 'nodemailer';
import { env } from '@/config/env.config';

export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.NODE_ENV === 'production' ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  from: env.EMAIL_FROM,
};

export const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth,
});
