import { User } from '@/features/auth';
import { ActiveType, IdentifiableType, TimestampType } from '@/types';

export interface Tasbeeh extends IdentifiableType, TimestampType, ActiveType {
  name: string;
  text: string;
  target: number;
  user: User | null;
  userId?: string;
}
