import { Router } from 'express';
import z from 'zod';
import {
  createConversationController,
  getConversationsController,
  getConversationController,
  sendMessageController,
  deleteConversationController,
  deleteAllConversationsController,
} from '@/features/chat';
import { authenticate } from '@/middlewares';
import { validate } from '@/middlewares/validation.middleware';
import {
  createConversationSchema,
  sendMessageSchema,
  conversationIdParamsSchema,
  listConversationsQuerySchema,
} from '@/features/chat/validation/chat.validations';

export const chatsRouter = Router();

// All routes require authentication
chatsRouter.use(authenticate);

// Create new conversation
chatsRouter.post('/', validate({ body: createConversationSchema }), createConversationController);

// List all conversations
chatsRouter.get('/', validate({ query: listConversationsQuerySchema }), getConversationsController);

// Get single conversation
chatsRouter.get(
  '/:id',
  validate({ params: conversationIdParamsSchema }),
  getConversationController,
);

// Send message (chat)
chatsRouter.post(
  '/:id/messages',
  validate({
    params: conversationIdParamsSchema,
    body: sendMessageSchema,
  }),
  sendMessageController,
);

// Delete conversation
chatsRouter.delete(
  '/:id',
  validate({ params: conversationIdParamsSchema }),
  deleteConversationController,
);

// Delete all conversations
chatsRouter.delete('/', deleteAllConversationsController);
