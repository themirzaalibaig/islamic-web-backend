import { ActiveType, IdentifiableType, TimestampType } from '@/types';

export interface Test extends TimestampType, ActiveType, IdentifiableType {
  firstName: string;
  lastName: string;
  email: string;
}
