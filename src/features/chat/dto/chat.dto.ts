import z from 'zod';
import {
  createConversationSchema,
  sendMessageSchema,
  conversationIdParamsSchema,
  listConversationsQuerySchema,
} from '@/features/chat/validation/chat.validations';

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;
export type ConversationIdParams = z.infer<typeof conversationIdParamsSchema>;
export type ListConversationsQueryDto = z.infer<typeof listConversationsQuerySchema>;
