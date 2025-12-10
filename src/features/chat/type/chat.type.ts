import { IdentifiableType, TimestampType, ActiveType } from '@/types';

export interface MessageSource {
  type: 'quran' | 'hadith';
  reference: string;
  text: string;
  metadata?: {
    chapterId?: number;
    verseNumber?: number;
    collectionName?: string;
    hadithNumber?: string;
    bookNumber?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: MessageSource[];
  createdAt: Date;
}

export interface Chat extends IdentifiableType, TimestampType, ActiveType {
  userId: string;
  title: string;
  messages: ChatMessage[];
}
