import { UserRole } from '@/enums';
import { ActiveType, IdentifiableType, TimestampType } from '@/types';

export interface User extends IdentifiableType, TimestampType, ActiveType {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  fiqh?: string;
  avatar?: string;
  isVerified?: boolean;
  token?: string;
  code?: {
    otp?: string;
    expiresAt?: Date;
  };
}
